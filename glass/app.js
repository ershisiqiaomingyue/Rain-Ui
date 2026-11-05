/* Rain — view rendering and interaction.
   Everything on screen comes from window.RAIN (see data.js). */
(function () {
  'use strict';

  const RAIN = window.RAIN;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    projectId: RAIN.activeProjectId,
    flowId: 'invoice-expense',
    view: 'dashboard',
    dashTab: 'workflows',
    canvasTab: 'diagram',
    search: '',
    zoom: 1,
    paused: new Set(),
    running: false,
  };

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const num = (n) => Number(n).toLocaleString('en-US');
  const money = (n) => '$' + Number(n).toLocaleString('en-US');
  const plural = (n, one, many) => (n === 1 ? one : many);
  const esc = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );

  const icon = (name, cls = '') => `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${name}" /></svg>`;

  const project = () => RAIN.projects.find((p) => p.id === state.projectId);
  const flow = () => RAIN.flows[state.flowId];
  const workflow = (id) => project().workflows.find((w) => w.id === id);
  const ownerOfFlow = (id) => RAIN.projects.find((p) => p.workflows.some((w) => w.id === id));

  const KIND_ICON = { telegram: 'send', schedule: 'clock', webhook: 'bolt' };
  const kindIcon = (kind) => KIND_ICON[kind] || 'bolt';
  const APP_ICON = {
    Telegram: 'send',
    Schedule: 'clock',
    Webhook: 'bolt',
    Condition: 'branch',
    Approval: 'user-check',
    'Google Sheets': 'grid',
    Slack: 'send',
    Notion: 'layers',
    Compose: 'layers',
    Form: 'layers',
    Filter: 'filter',
    Airtable: 'grid',
    Rain: 'drop',
  };
  const appIcon = (app) => APP_ICON[app] || 'bolt';

  const triggerLabel = (wf) =>
    ({ telegram: 'Telegram trigger', schedule: 'Scheduled trigger', webhook: 'Webhook trigger' })[wf.kind] ||
    'Trigger';

  /* ---------------------------------------------------------------------
     Shell: workspace identity, sidebar tree, counts
     --------------------------------------------------------------------- */

  function renderShell() {
    const p = project();
    const pending = p.approvals.length;

    $('#wsName').textContent = p.name;
    $('#wsScope').textContent = p.scope;
    $('#wsBadge').textContent = p.initials;

    $('#statusScope').textContent = `${p.name} · ${p.workflows.length} workflows`;
    $('#statusMeta').textContent = `${p.runs} runs · ${p.successRate.toFixed(1)}% succeeded`;
    $('#docTitle').textContent =
      state.view === 'canvas'
        ? $('#flowTitle').textContent || VIEW_LABEL.canvas
        : VIEW_LABEL[state.view];

    const count = $('#approvalCount');
    count.textContent = pending;
    count.hidden = pending === 0;

    $$('.nav-item').forEach((btn) => {
      btn.setAttribute('aria-current', btn.dataset.view === state.view ? 'page' : 'false');
    });

    $('#projectTree').innerHTML = RAIN.projects
      .map((proj) => {
        const open = proj.id === p.id;
        const flows = proj.workflows
          .map((wf) => {
            const current = state.view === 'canvas' && state.flowId === wf.id;
            return `<button class="tree-flow" type="button" data-flow="${wf.id}" aria-current="${current}">
              ${icon(kindIcon(wf.kind))}
              <span>${esc(wf.name)}</span>
            </button>`;
          })
          .join('');

        return `<div class="tree-project" data-open="${open}">
          <button type="button" data-project-toggle="${proj.id}" aria-expanded="${open}">
            ${icon('chev-right', 'tree-chev')}
            <span class="tree-dot" aria-hidden="true"></span>
            <span>${esc(proj.name)}</span>
            <span class="tree-count">${proj.workflows.length}</span>
          </button>
          ${
            open
              ? `<div class="tree-flows">${flows}
                  <button class="tree-create" type="button" data-action="new-workflow">
                    ${icon('plus')}
                    <span>New workflow</span>
                  </button>
                </div>`
              : ''
          }
        </div>`;
      })
      .join('');
  }

  /* ---------------------------------------------------------------------
     Dashboard
     --------------------------------------------------------------------- */

  function renderDashboard() {
    const p = project();
    const pending = p.approvals.length;

    $('#dashboardLede').innerHTML =
      `${num(p.runs)} runs in the last seven days, <strong>${p.delta >= 0 ? '+' : ''}${Math.round(p.deltaPct)}%</strong> against the week before. ` +
      (pending
        ? `<strong>${pending}</strong> ${plural(pending, 'approval is', 'approvals are')} waiting on you.`
        : 'Nothing is waiting on you.');

    $('#kpis').innerHTML = `
      <div class="kpi">
        <div class="kpi-label">Executions</div>
        <div class="kpi-value">${num(p.runs)}</div>
        <div class="kpi-meta">
          <span class="delta${p.delta >= 0 ? '' : ' delta-flat'}">
            ${icon(p.delta >= 0 ? 'arrow-up-right' : 'minus')}
            ${p.deltaPct.toFixed(1)}%
          </span>
          <span>${num(Math.abs(p.delta))} ${p.delta >= 0 ? 'more' : 'fewer'} than the week before</span>
        </div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Succeeded</div>
        <div class="kpi-value">${num(p.succeeded)}<small>of ${num(p.runs)}</small></div>
        <div class="kpi-meta">
          ${
            p.failures
              ? `<span class="fail-note">${p.failures} failed</span><span aria-hidden="true">·</span>`
              : '<span>No failed runs</span><span aria-hidden="true">·</span>'
          }
          <span>${p.successRate.toFixed(1)}% success</span>
        </div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Manual time saved</div>
        <div class="kpi-value">${p.savedLabel}</div>
        <div class="kpi-meta">
          <span>${(p.minutesSaved / Math.max(1, p.runs)).toFixed(1)} min per run on average</span>
        </div>
      </div>`;

    $('#chartTotal').textContent = `${num(p.runs)} runs`;
    $('#chartSub').textContent = 'Bars: this week · dashed: last week';
    $('#chartNote').textContent = p.note;

    $('#approvalMeta').textContent = pending ? `${pending} waiting` : 'Clear';
    $('#approvalList').innerHTML = pending
      ? p.approvals
          .map(
            (a) => `<div class="approval">
              <div class="approval-main">
                <strong>${esc(a.title)}</strong>
                <span>${esc(a.who)} · waiting ${esc(a.age)}</span>
              </div>
              <div class="approval-side">
                <span class="approval-amount">${money(a.amount)}</span>
                <button class="btn-tiny" type="button" data-approve="${a.id}">Approve</button>
              </div>
            </div>`,
          )
          .join('')
      : `<div class="card-empty">
          <strong>Nothing waiting</strong>
          <span>Runs that reach a human step will collect here.</span>
        </div>`;

    renderDashList();
  }

  function renderChart() {
    const host = $('#chart');
    if (!host || !host.offsetParent) return;

    const p = project();
    const w = Math.max(280, host.clientWidth);
    const h = Math.max(150, host.clientHeight);
    const pad = { l: 30, r: 6, t: 24, b: 22 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const peak = Math.max(...p.daily, ...p.priorDaily, 1);
    const niceMax = peak <= 8 ? Math.ceil(peak) + 1 : Math.ceil((peak * 1.16) / 20) * 20;
    const stepV = niceMax / 4;
    const yFor = (v) => pad.t + plotH - (v / niceMax) * plotH;
    const slot = plotW / 7;
    const barW = Math.min(30, slot * 0.44);

    const grid = [0, 1, 2, 3, 4]
      .map((i) => {
        const v = stepV * i;
        const y = yFor(v);
        return `<line class="gridline" x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" />
                <text class="axis-label" x="${pad.l - 8}" y="${y + 3.5}" text-anchor="end">${Math.round(v)}</text>`;
      })
      .join('');

    const bars = p.daily
      .map((v, i) => {
        const cx = pad.l + slot * i + slot / 2;
        const y = yFor(v);
        const today = i === p.daily.length - 1;
        return `<rect class="bar${today ? ' bar-today' : ''}" x="${(cx - barW / 2).toFixed(1)}" y="${y.toFixed(1)}"
                  width="${barW.toFixed(1)}" height="${(pad.t + plotH - y).toFixed(1)}" rx="6">
                  <title>${p.weekdays[i]} · ${v} runs</title>
                </rect>
                ${
                  today
                    ? `<text class="bar-value" x="${cx.toFixed(1)}" y="${(y - 8).toFixed(1)}" text-anchor="middle">${v}</text>`
                    : ''
                }`;
      })
      .join('');

    const labels = p.daily
      .map((v, i) => {
        const cx = pad.l + slot * i + slot / 2;
        const today = i === p.daily.length - 1;
        return `<text class="axis-label" x="${cx.toFixed(1)}" y="${h - 4}" text-anchor="middle"
                  style="${today ? 'fill:rgba(255,255,255,0.82)' : ''}">${p.weekdays[i]}</text>`;
      })
      .join('');

    const prior = p.priorDaily
      .map((v, i) => `${(pad.l + slot * i + slot / 2).toFixed(1)},${yFor(v).toFixed(1)}`)
      .join(' ');

    host.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img"
      aria-label="Executions per day this week: ${p.daily.join(', ')}. Last week: ${p.priorDaily.join(', ')}.">
      ${grid}
      <polyline points="${prior}" fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="1.3"
        stroke-dasharray="3 4" stroke-linecap="round" stroke-linejoin="round" />
      ${bars}
      ${labels}
    </svg>`;
  }

  function renderDashList() {
    const p = project();
    const box = $('#dashList');
    const q = state.search.trim().toLowerCase();
    const tab = state.dashTab;

    $('#tab-workflows').setAttribute('aria-selected', String(tab === 'workflows'));
    $('#tab-executions').setAttribute('aria-selected', String(tab === 'executions'));
    box.setAttribute('aria-labelledby', tab === 'workflows' ? 'tab-workflows' : 'tab-executions');

    if (tab === 'workflows') {
      const rows = p.workflows.filter((wf) =>
        `${wf.name} ${wf.trigger} ${wf.owner}`.toLowerCase().includes(q),
      );
      $('#listMeta').textContent = q
        ? `${rows.length} of ${p.workflows.length} match`
        : `${p.workflows.length} workflows · ${num(p.runs)} runs`;

      box.innerHTML =
        `<div class="list-head" aria-hidden="true">
          <span>Workflow</span>
          <span class="num">Runs</span>
          <span class="num col-success">Success</span>
          <span class="num col-last">Last run</span>
          <span></span>
        </div>` +
        (rows.length
          ? rows
              .map(
                (wf) => `<button class="wf-row" type="button" data-flow="${wf.id}"
                    aria-label="Open ${esc(wf.name)} in the builder">
                  <span class="wf-main">
                    <span class="flow-mark">${icon(kindIcon(wf.kind))}</span>
                    <span class="wf-text">
                      <strong>${esc(wf.name)}</strong>
                      <span>${esc(wf.trigger)} · ${esc(wf.owner)}</span>
                    </span>
                  </span>
                  <span class="wf-num num">${num(wf.runs)}</span>
                  <span class="wf-success${wf.failures ? ' is-hit' : ''}">
                    ${wf.failures ? `${wf.failures} failed` : `${((1 - wf.failures / wf.runs) * 100).toFixed(0)}%`}
                  </span>
                  <span class="wf-last">${esc(wf.lastRun)}</span>
                  <span class="wf-chev">${icon('chev-right')}</span>
                </button>`,
              )
              .join('')
          : `<div class="list-empty"><strong>No workflows match “${esc(state.search.trim())}”</strong>
              Try a trigger, an owner or part of a name.</div>`) +
        `<button class="wf-create" type="button" data-action="new-workflow">
          <span class="plus">${icon('plus')}</span>
          <span class="wf-create-text">
            <strong>Create a workflow</strong>
            <span>Start from a trigger or one of the five templates</span>
          </span>
        </button>`;
      return;
    }

    const rows = p.executions.filter((run) => {
      const wf = p.workflows.find((w) => w.id === run.workflowId);
      return `${run.id} ${wf ? wf.name : ''} ${run.status}`.toLowerCase().includes(q);
    });
    const shown = rows.slice(0, 5);
    const median = medianSeconds(rows);

    $('#listMeta').textContent = q
      ? `${rows.length} of ${p.executions.length} match`
      : `Latest ${Math.min(5, p.executions.length)} of ${p.executions.length} runs`;

    box.innerHTML =
      `<div class="run-head" aria-hidden="true">
        <span class="col-runid">Run</span>
        <span>Workflow</span>
        <span class="num col-started">Started</span>
        <span class="num col-duration">Duration</span>
        <span>Status</span>
      </div>` +
      (shown.length
        ? shown.map((run) => runRow(run, p)).join('')
        : `<div class="list-empty"><strong>No runs match “${esc(state.search.trim())}”</strong>
            Clear the search to see the latest runs.</div>`) +
      `<div class="list-foot">
        <span>Showing ${shown.length} of ${p.executions.length} runs</span>
        <span>Median ${median.toFixed(1)} s</span>
      </div>`;
  }

  function medianSeconds(rows) {
    if (!rows.length) return 0;
    const values = rows.map((r) => r.duration).sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  }

  function runRow(run, p) {
    const wf = p.workflows.find((w) => w.id === run.workflowId);
    return `<div class="run-row">
      <span class="run-id">${esc(run.id)}</span>
      <span class="run-flow">
        ${icon(kindIcon(wf ? wf.kind : 'webhook'))}
        <span>${esc(wf ? wf.name : 'Deleted workflow')}</span>
        ${run.note ? `<span class="run-note">${esc(run.note)}</span>` : ''}
      </span>
      <span class="run-time num col-started">${esc(run.started)}</span>
      <span class="run-time num col-duration">${run.duration.toFixed(1)} s</span>
      <span class="status status-${run.status}">${esc(cap(run.status))}</span>
    </div>`;
  }

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------------------------------------------------------------------
     Runs + approvals views
     --------------------------------------------------------------------- */

  function renderRuns() {
    const p = project();
    const failed = p.executions.find((r) => r.status === 'failed');
    const median = medianSeconds(p.executions);

    $('#runsLede').innerHTML =
      `${p.executions.length} recent ${plural(p.executions.length, 'run', 'runs')}, median <strong>${median.toFixed(1)} s</strong>. ` +
      (failed
        ? `<strong>${esc(failed.id)}</strong> failed when ${esc(failed.note.toLowerCase())}.`
        : 'No failed runs this week.');

    $('#runsTable').innerHTML =
      `<div class="run-head" aria-hidden="true">
        <span class="col-runid">Run</span>
        <span>Workflow</span>
        <span class="num col-started">Started</span>
        <span class="num col-duration">Duration</span>
        <span>Status</span>
      </div>` +
      (p.executions.length
        ? p.executions.map((run) => runRow(run, p)).join('')
        : `<div class="list-empty"><strong>No runs yet</strong>
            Runs appear here as soon as a trigger fires.</div>`) +
      `<div class="list-foot">
        <span>${p.executions.length} runs · week of Nov 3</span>
        <span>${p.workflows.length} workflows</span>
      </div>`;
  }

  function renderApprovals() {
    const p = project();
    const list = p.approvals;
    const oldest = list.reduce((acc, a) => (parseInt(a.age, 10) > parseInt(acc, 10) ? a.age : acc), '0 h');

    $('#approvalsLede').innerHTML = list.length
      ? `${list.length} ${plural(list.length, 'item waits', 'items wait')} for a decision. The oldest has been open for <strong>${esc(oldest)}</strong>.`
      : 'Nothing is waiting. Approvals appear here when a run reaches a human step.';

    $('#approvalNote').textContent = list.length
      ? 'Approving resumes the run where it stopped. Nothing else is waiting right now.'
      : 'Approved and sent-back items stay in the run history.';

    $('#approvalCards').innerHTML = list.length
      ? list
          .map((a) => {
            const wf = p.workflows.find((w) => w.id === a.workflowId);
            return `<article class="approval-card">
              <div class="approval-card-top">
                <div>
                  <h2>${esc(a.title)}</h2>
                  <p class="who">${esc(a.who)}</p>
                </div>
                <div class="amount">${money(a.amount)}</div>
              </div>
              <dl class="approval-details">
                <div class="detail-row"><dt>Workflow</dt><dd>${esc(wf ? wf.name : 'Removed workflow')}</dd></div>
                <div class="detail-row"><dt>Detail</dt><dd>${esc(a.note)}</dd></div>
                <div class="detail-row"><dt>Waiting</dt><dd>${esc(a.age)}</dd></div>
              </dl>
              <div class="approval-card-actions">
                <button class="btn btn-quiet" type="button" data-approve="${a.id}">${icon('check')}Approve</button>
                <button class="link-btn" type="button" data-sendback="${a.id}">Send back</button>
              </div>
            </article>`;
          })
          .join('')
      : `<div class="approval-card">
          <div class="card-empty">
            <strong>Queue clear</strong>
            <span>Every run this week passed its human step.</span>
          </div>
        </div>`;
  }

  /* ---------------------------------------------------------------------
     Builder canvas
     --------------------------------------------------------------------- */

  function renderCanvas() {
    const f = flow();
    if (!f) return;
    const owner = ownerOfFlow(state.flowId);
    const wf = owner ? owner.workflows.find((w) => w.id === state.flowId) : null;
    const paused = state.paused.has(state.flowId);

    $('#flowTitle').textContent = wf ? wf.name : 'Untitled workflow';
    $('#flowMeta').textContent = `${f.nodes.length} steps · ${wf ? triggerLabel(wf) : 'No trigger'} · ${
      paused ? 'Paused' : 'Live'
    }`;
    $('#canvasStatus').textContent = paused
      ? `${f.nodes.length} steps · trigger paused`
      : `Saved just now · ${f.nodes.length} steps`;
    $('#activeToggle').checked = !paused;

    $('#nodes').innerHTML = f.nodes
      .map(
        (n) => `<article class="node" data-node="${n.id}" tabindex="0"
            style="left:${n.x}px;top:${n.y}px"
            aria-label="${esc(n.app)}: ${esc(n.title)}. Drag or use the arrow keys to move.">
          <div class="node-top">
            <span class="node-glyph">${icon(appIcon(n.app))}</span>
            <span class="node-app">${esc(n.app)}</span>
            <span class="node-badge">${esc(n.badge)}</span>
          </div>
          <div class="node-title">${esc(n.title)}</div>
          <div class="node-rows">
            ${n.rows
              .map(
                (r) => `<div class="node-row">
                  <span class="key">${esc(r.label)}</span>
                  <span class="eq">=</span>
                  <span class="val">${esc(r.value)}</span>
                </div>`,
              )
              .join('')}
          </div>
        </article>`,
      )
      .join('');

    bindNodes();
    drawWires();
    if (state.canvasTab === 'history') renderHistory();
  }

  function drawWires() {
    const f = flow();
    const svg = $('#wires');
    if (!f || !svg) return;

    const nodes = new Map(f.nodes.map((n) => [n.id, n]));
    const elFor = (id) => $(`.node[data-node="${id}"]`);

    svg.innerHTML = f.edges
      .map((edge) => {
        const a = nodes.get(edge.from);
        const b = nodes.get(edge.to);
        const ae = elFor(edge.from);
        const be = elFor(edge.to);
        if (!a || !b || !ae || !be) return '';

        const aw = ae.offsetWidth;
        const ah = ae.offsetHeight;
        const bw = be.offsetWidth;
        const bh = be.offsetHeight;
        let x1;
        let y1;
        let x2;
        let y2;
        let d;

        if (b.x >= a.x + aw + 24) {
          x1 = a.x + aw;
          y1 = a.y + ah / 2;
          x2 = b.x;
          y2 = b.y + bh / 2;
          const dx = Math.max(36, (x2 - x1) * 0.5);
          d = `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
        } else if (b.y >= a.y + ah + 16) {
          x1 = a.x + aw / 2;
          y1 = a.y + ah;
          x2 = b.x + bw / 2;
          y2 = b.y;
          const dy = Math.max(28, (y2 - y1) * 0.5);
          d = `M${x1} ${y1} C${x1} ${y1 + dy} ${x2} ${y2 - dy} ${x2} ${y2}`;
        } else {
          x1 = a.x + aw;
          y1 = a.y + ah / 2;
          x2 = b.x;
          y2 = b.y + bh / 2;
          const dx = Math.max(36, Math.abs(x2 - x1) * 0.5);
          d = `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
        }

        const label = edge.label
          ? `<text class="wire-label" x="${((x1 + x2) / 2).toFixed(1)}" y="${((y1 + y2) / 2 - 7).toFixed(1)}"
              text-anchor="middle">${esc(edge.label)}</text>`
          : '';

        return `<path class="wire" d="${d}" data-edge="${edge.from}-${edge.to}" />${label}`;
      })
      .join('');
  }

  function bindNodes() {
    const f = flow();
    $$('.node').forEach((el) => {
      const node = f.nodes.find((n) => n.id === el.dataset.node);
      if (!node) return;

      el.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 && event.pointerType === 'mouse') return;
        event.preventDefault();
        el.focus({ preventScroll: true });
        el.setPointerCapture(event.pointerId);
        el.classList.add('is-dragging');
        const start = { x: event.clientX, y: event.clientY, nx: node.x, ny: node.y };

        const move = (ev) => {
          node.x = clamp(start.nx + (ev.clientX - start.x) / state.zoom, 0, 1040 - el.offsetWidth);
          node.y = clamp(start.ny + (ev.clientY - start.y) / state.zoom, 0, 600 - el.offsetHeight);
          el.style.left = `${node.x}px`;
          el.style.top = `${node.y}px`;
          drawWires();
        };

        const up = () => {
          el.classList.remove('is-dragging');
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerup', up);
          el.removeEventListener('pointercancel', up);
        };

        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
      });

      el.addEventListener('keydown', (event) => {
        const delta = event.shiftKey ? 24 : 8;
        const moves = {
          ArrowLeft: [-delta, 0],
          ArrowRight: [delta, 0],
          ArrowUp: [0, -delta],
          ArrowDown: [0, delta],
        };
        const move = moves[event.key];
        if (!move) return;
        event.preventDefault();
        node.x = clamp(node.x + move[0], 0, 1040 - el.offsetWidth);
        node.y = clamp(node.y + move[1], 0, 600 - el.offsetHeight);
        el.style.left = `${node.x}px`;
        el.style.top = `${node.y}px`;
        drawWires();
      });
    });
  }

  function renderHistory() {
    const p = project();
    const runs = p.executions.filter((r) => r.workflowId === state.flowId);
    const host = $('#flowHistory');

    host.innerHTML =
      `<div class="history-head" aria-hidden="true">
        <span>Run</span><span>Started</span><span>Duration</span><span>Status</span>
      </div>` +
      (runs.length
        ? runs
            .map(
              (run) => `<div class="history-row">
                <span class="run-id">${esc(run.id)}</span>
                <span class="run-time">${esc(run.started)}</span>
                <span class="run-time">${run.duration.toFixed(1)} s</span>
                <span class="status status-${run.status}">${esc(cap(run.status))}</span>
              </div>`,
            )
            .join('')
        : `<div class="list-empty"><strong>No runs yet</strong>
            Runs for this workflow will appear here after the trigger fires.</div>`) +
      `<div class="list-foot"><span>${runs.length} ${plural(runs.length, 'run', 'runs')} this week</span>
        <span>${esc(triggerLabel(workflow(state.flowId) || { kind: 'webhook' }))}</span></div>`;
  }

  async function runFlow() {
    if (state.running) return;
    const f = flow();
    const btn = $('#runFlow');
    const status = $('#canvasStatus');
    state.running = true;
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    const startedAt = performance.now();

    $$('.node').forEach((el) => el.classList.remove('is-live'));
    $$('.wire').forEach((el) => el.classList.remove('is-live'));

    for (let i = 0; i < f.nodes.length; i += 1) {
      const node = f.nodes[i];
      status.textContent = `Running step ${i + 1} of ${f.nodes.length} · ${node.title}`;
      const el = $(`.node[data-node="${node.id}"]`);
      if (el) el.classList.add('is-live');
      const previous = f.nodes[i - 1];
      if (previous) {
        $$(`.wire[data-edge^="${previous.id}-"]`).forEach((wire) => wire.classList.add('is-live'));
      }
      await wait(560);
    }

    await wait(420);
    const elapsed = (performance.now() - startedAt) / 1000;
    const paused = state.paused.has(state.flowId);

    state.running = false;
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
    status.textContent = paused
      ? `${f.nodes.length} steps · trigger paused`
      : `Saved just now · ${f.nodes.length} steps`;
    $$('.node, .wire').forEach((el) => el.classList.remove('is-live'));

    notify(
      'Test run finished',
      `${elapsed.toFixed(1)} s across ${f.nodes.length} steps${paused ? '. The workflow is paused, so the trigger will not fire' : ''}.`,
    );
  }

  /* ---------------------------------------------------------------------
     Navigation
     --------------------------------------------------------------------- */

  const VIEW_LABEL = { dashboard: 'Dashboard', runs: 'Runs', approvals: 'Approvals', canvas: 'Builder' };

  function setView(view) {
    state.view = view;
    $$('.view').forEach((section) => {
      section.hidden = section.id !== `view-${view}`;
    });
    $$('.nav-item').forEach((btn) => {
      btn.setAttribute('aria-current', btn.dataset.view === view ? 'page' : 'false');
    });

    const title = view === 'canvas' ? $('#flowTitle').textContent : VIEW_LABEL[view];
    document.title = `${title} · Rain`;
    renderShell();

    if (view === 'dashboard') requestAnimationFrame(renderChart);
    if (view === 'canvas') requestAnimationFrame(drawWires);
    closeSidebar();
  }

  function navigate(view) {
    setView(view);
    const route = view === 'canvas' ? `#/flow/${state.flowId}` : `#/${view}`;
    writeRoute(route);
  }

  function writeRoute(route) {
    try {
      history.replaceState(null, '', route);
    } catch (error) {
      /* some browsers refuse hash rewrites on file://, navigation still works */
    }
  }

  function openFlow(id) {
    if (!RAIN.flows[id]) return;
    const owner = ownerOfFlow(id);
    const changedProject = owner && owner.id !== state.projectId;
    if (owner) state.projectId = owner.id;
    state.flowId = id;
    if (changedProject) {
      renderAll();
    } else {
      renderCanvas();
      renderShell();
    }
    setView('canvas');
    writeRoute(`#/flow/${id}`);
  }

  function setProject(id) {
    const next = RAIN.projects.find((p) => p.id === id);
    if (!next) return;
    state.projectId = id;
    if (!next.workflows.some((w) => w.id === state.flowId)) {
      state.flowId = next.workflows[0].id;
    }
    state.search = '';
    $('#searchInput').value = '';
    renderAll();
  }

  function renderAll() {
    renderShell();
    renderDashboard();
    renderRuns();
    renderApprovals();
    renderCanvas();
    if (state.view === 'dashboard') requestAnimationFrame(renderChart);
  }

  function readHash() {
    const raw = location.hash.replace(/^#\/?/, '');
    if (raw.startsWith('flow/')) {
      const id = raw.slice(5);
      const owner = ownerOfFlow(id);
      if (owner && RAIN.flows[id]) {
        state.projectId = owner.id;
        state.flowId = id;
        return 'canvas';
      }
    }
    if (raw === 'runs' || raw === 'approvals') return raw;
    return 'dashboard';
  }

  /* ---------------------------------------------------------------------
     Approvals
     --------------------------------------------------------------------- */

  function resolveApproval(id, mode) {
    const p = project();
    const index = p.approvals.findIndex((a) => a.id === id);
    if (index === -1) return;
    const [item] = p.approvals.splice(index, 1);

    renderDashboard();
    renderApprovals();
    renderShell();
    if (state.view === 'dashboard') renderChart();

    notify(
      mode === 'approve' ? 'Approval recorded' : 'Sent back',
      mode === 'approve'
        ? `${item.title} · ${money(item.amount)} released to ${item.who}.`
        : `${item.title} returned to ${item.who} for more detail.`,
      mode === 'approve' ? 'ok' : 'error',
    );
  }

  /* ---------------------------------------------------------------------
     Toasts
     --------------------------------------------------------------------- */

  function notify(title, body, tone = 'ok') {
    const host = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast';
    el.dataset.tone = tone;
    el.innerHTML = `
      <span class="toast-icon">${icon(tone === 'ok' ? 'check' : 'arrow-left')}</span>
      <span class="toast-body"><strong>${esc(title)}</strong><span>${esc(body)}</span></span>`;
    host.appendChild(el);

    const remove = () => {
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 240);
    };
    setTimeout(remove, 4200);
  }

  /* ---------------------------------------------------------------------
     Drawer
     --------------------------------------------------------------------- */

  function openSidebar() {
    $('#sidebar').classList.add('is-open');
    $('#scrim').hidden = false;
    $('#menuBtn').setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    $('#sidebar').classList.remove('is-open');
    $('#scrim').hidden = true;
    $('#menuBtn').setAttribute('aria-expanded', 'false');
  }

  /* ---------------------------------------------------------------------
     Zoom
     --------------------------------------------------------------------- */

  const ZOOMS = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25];

  function setZoom(value) {
    state.zoom = clamp(Math.round(value * 100) / 100, 0.5, 1.25);
    $('#stageFrame').style.setProperty('--zoom', state.zoom);
    $('#zoomLabel').textContent = `${Math.round(state.zoom * 100)}%`;
  }

  function zoomBy(direction) {
    const current = state.zoom;
    const next =
      direction > 0
        ? ZOOMS.find((z) => z > current + 0.001) || ZOOMS[ZOOMS.length - 1]
        : [...ZOOMS].reverse().find((z) => z < current - 0.001) || ZOOMS[0];
    setZoom(next);
  }

  function fitCanvas() {
    const host = $('#canvasScroll');
    if (!host) return;
    const scale = Math.min((host.clientWidth - 24) / 1040, (host.clientHeight - 24) / 600);
    setZoom(Math.max(0.5, Math.min(1, scale)));
  }

  /* ---------------------------------------------------------------------
     Export
     --------------------------------------------------------------------- */

  function exportCsv() {
    const p = project();
    const rows = [['Run', 'Workflow', 'Started', 'Duration (s)', 'Status', 'Note']].concat(
      p.executions.map((run) => {
        const wf = p.workflows.find((w) => w.id === run.workflowId);
        return [run.id, wf ? wf.name : '', run.started, run.duration, run.status, run.note || ''];
      }),
    );
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `rain-runs-${p.id}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify('Export ready', `${p.executions.length} runs written to rain-runs-${p.id}.csv.`);
  }

  /* ---------------------------------------------------------------------
     Events
     --------------------------------------------------------------------- */

  document.addEventListener('click', (event) => {
    const viewBtn = event.target.closest('[data-view]');
    if (viewBtn) {
      navigate(viewBtn.dataset.view);
      return;
    }

    const flowBtn = event.target.closest('[data-flow]');
    if (flowBtn) {
      openFlow(flowBtn.dataset.flow);
      return;
    }

    const toggle = event.target.closest('[data-project-toggle]');
    if (toggle) {
      const id = toggle.dataset.projectToggle;
      if (id === state.projectId) {
        const row = toggle.closest('.tree-project');
        const open = row.dataset.open === 'true';
        row.dataset.open = String(!open);
        toggle.setAttribute('aria-expanded', String(!open));
      } else {
        setProject(id);
      }
      return;
    }

    const approve = event.target.closest('[data-approve]');
    if (approve) {
      resolveApproval(approve.dataset.approve, 'approve');
      return;
    }

    const sendBack = event.target.closest('[data-sendback]');
    if (sendBack) {
      resolveApproval(sendBack.dataset.sendback, 'sendback');
      return;
    }

    const action = event.target.closest('[data-action]');
    if (action) {
      const notes = {
        'new-workflow':
          'Workflow creation is outside this HTML demo. The five workflows here are the sample data.',
        'new-project': 'Projects are fixed in this demo: Kretya and Asal Design.',
        shortcuts: 'Press / to search, ⌘↵ to run a workflow, and the arrow keys to nudge a node.',
      };
      notify(
        action.dataset.action === 'shortcuts' ? 'Keyboard shortcuts' : 'Not part of the demo',
        notes[action.dataset.action] || 'This control is decorative in the demo.',
        action.dataset.action === 'shortcuts' ? 'ok' : 'error',
      );
      return;
    }

    const tab = event.target.closest('[data-tab]');
    if (tab) {
      state.dashTab = tab.dataset.tab;
      renderDashList();
      $('#dashList').focus({ preventScroll: true });
      return;
    }

    const canvasTab = event.target.closest('[data-canvas-tab]');
    if (canvasTab) {
      const next = canvasTab.dataset.canvasTab;
      state.canvasTab = next;
      $$('#canvasTabs button').forEach((b) => {
        b.setAttribute('aria-selected', String(b.dataset.canvasTab === next));
      });
      $('#canvasScroll').hidden = next !== 'diagram';
      $('#flowHistory').hidden = next !== 'history';
      if (next === 'history') renderHistory();
      else requestAnimationFrame(drawWires);
      return;
    }

    const zoomBtn = event.target.closest('[data-zoom]');
    if (zoomBtn) {
      const kind = zoomBtn.dataset.zoom;
      if (kind === 'in') zoomBy(1);
      else if (kind === 'out') zoomBy(-1);
      else fitCanvas();
    }
  });

  $('#searchInput').addEventListener('input', (event) => {
    state.search = event.target.value;
    if (state.view !== 'dashboard') navigate('dashboard');
    renderDashList();
    renderChart();
  });

  $('#dashTabs').addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const tabs = $$('#dashTabs button');
    const index = tabs.indexOf(document.activeElement);
    if (index === -1) return;
    event.preventDefault();
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    next.focus();
    next.click();
  });

  $('#menuBtn').addEventListener('click', openSidebar);
  $('#sidebarClose').addEventListener('click', closeSidebar);
  $('#scrim').addEventListener('click', closeSidebar);

  $('#shareBtn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      notify('Link copied', 'Anyone on the team can open this view.');
    } catch (error) {
      notify('Copy the address bar', 'The clipboard is blocked in this browser.', 'error');
    }
  });

  /* Wallpaper switch. Every surface here is drawn with white and black
     alphas only, so removing the wallpaper hands back a neutral interface
     with nothing of its own to hide. */
  const wallToggle = $('#wallToggle');
  if (wallToggle) {
    const root = document.documentElement;
    wallToggle.addEventListener('click', () => {
      const off = root.dataset.wallpaper === 'off';
      root.dataset.wallpaper = off ? 'on' : 'off';
      wallToggle.setAttribute('aria-pressed', String(!off));
      requestAnimationFrame(drawWires);
    });
  }

  $('#exportBtn').addEventListener('click', exportCsv);

  $('#newWorkflowBtn').addEventListener('click', () => {
    notify(
      'Not part of the demo',
      'Workflow creation is outside this HTML demo. The five workflows here are the sample data.',
      'error',
    );
  });

  $('#activeToggle').addEventListener('change', (event) => {
    const on = event.target.checked;
    if (on) state.paused.delete(state.flowId);
    else state.paused.add(state.flowId);
    renderCanvas();
    notify(
      on ? 'Workflow active' : 'Workflow paused',
      on ? 'The trigger will fire on the next matching event.' : 'The trigger will not fire until you switch it back on.',
      on ? 'ok' : 'error',
    );
  });

  $('#runFlow').addEventListener('click', runFlow);

  document.addEventListener('keydown', (event) => {
    const typing =
      event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;

    if (event.key === '/' && !typing) {
      event.preventDefault();
      $('#searchInput').focus();
      return;
    }

    if (event.key === 'Escape') {
      if (document.activeElement === $('#searchInput')) {
        $('#searchInput').value = '';
        state.search = '';
        renderDashList();
        $('#searchInput').blur();
      }
      closeSidebar();
      return;
    }

    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && state.view === 'canvas') {
      event.preventDefault();
      runFlow();
    }
  });

  window.addEventListener('resize', () => {
    requestAnimationFrame(renderChart);
    requestAnimationFrame(drawWires);
  });

  if ('ResizeObserver' in window) {
    const chartHost = $('#chart');
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(renderChart);
    });
    observer.observe(chartHost);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      requestAnimationFrame(drawWires);
      requestAnimationFrame(renderChart);
    });
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */

  const initialView = readHash();
  renderAll();
  setZoom(1);
  setView(initialView);
  if (initialView === 'canvas') writeRoute(`#/flow/${state.flowId}`);
})();
