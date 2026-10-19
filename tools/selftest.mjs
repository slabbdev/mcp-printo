// Auto-test du router MCP en local, sans wrangler : `node tools/selftest.mjs`
import { handleRpc } from '../worker/worker.js';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const sha = (p) => createHash('sha256').update(readFileSync(new URL(p, import.meta.url))).digest('hex');
let pass = 0, fail = 0;
const ok = (cond, label) => { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'} — ${label}`); };

const init = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
ok(init.result?.serverInfo?.name === 'slabb-leaddev', 'initialize → serverInfo.name');
ok(init.result?.protocolVersion === '2025-06-18', 'initialize → protocolVersion');
ok(typeof init.result?.instructions === 'string' && init.result.instructions.length > 20, 'initialize → instructions');

const list = await handleRpc({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
const names = list.result.tools.map((t) => t.name);
ok(names.length === 6, `tools/list → 6 tools (${names.length})`);
ok(
  ['get_profile', 'get_sylius_proof', 'get_story', 'get_agentic_flow', 'get_missed_deadline_receipt', 'verify_receipt'].every((n) => names.includes(n)),
  'tools/list → noms attendus',
);

const call = async (name) =>
  (await handleRpc({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name, arguments: {} } })).result.content[0].text;

ok((await call('get_profile')).includes('Symfony'), 'get_profile');
ok((await call('get_profile')).includes('lead depuis 2019'), 'get_profile → lead depuis 2019');
ok((await call('get_sylius_proof')).includes('alma/sylius-2'), 'get_sylius_proof');

const story = await call('get_story');
ok(story.length <= 800, `get_story ≤ 800 car (${story.length})`);
ok(story.split('\n').length <= 5, `get_story ≤ 5 lignes (${story.split('\n').length})`);
ok(story.includes('Créneau loupé'), 'get_story → créneau loupé assumé');
ok(story.includes('McDo'), 'get_story → la blague McDo est dedans');
ok(story.includes("vu que j'avais le job"), 'get_story → le job est annoncé plié (verbatim Sam)');

ok((await call('get_agentic_flow')).includes('Ed25519'), 'get_agentic_flow');

const rec = await call('get_missed_deadline_receipt');
ok(rec.includes('98fbb384') && rec.includes('e6a0005d'), 'get_missed_deadline_receipt → h_get_offer + h_payload');
ok((await call('verify_receipt')).includes('05afbdc0'), 'verify_receipt → h_chain');

const badTool = await handleRpc({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'nope', arguments: {} } });
ok(badTool.error?.code === -32602, 'tool inconnu → -32602');
const badMethod = await handleRpc({ jsonrpc: '2.0', id: 5, method: 'nope' });
ok(badMethod.error?.code === -32601, 'méthode inconnue → -32601');

ok(sha('../archive/submit_application_prepared.json').startsWith('e6a0005d'), 'sha256(payload fichier) = h_payload');
ok(sha('../archive/get_offer_response_2026-10-19T17:56:27Z.json').startsWith('98fbb384'), 'sha256(archive get_offer) = h_get_offer');

console.log(`\n${pass}/${pass + fail} PASS`);
process.exit(fail ? 1 : 0);
