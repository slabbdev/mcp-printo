// Router MCP « candidature hors délai » — PrintOclock Lead Dev.
// Stateless streamable-HTTP JSON-RPC : POST /mcp, réponses JSON, lecture seule,
// ne collecte rien et ne soumet rien. Testable en node : `node tools/selftest.mjs`.

const STORY = [
  "Dev depuis 2004, pro depuis 2009, lead depuis 2019. Créneau loupé : annonce trouvée 9 jours après la fermeture — affaire pas lâchée, mon agent a fait le parcours quand même, ce dossier MCP est la preuve.",
  "Plus dur défi Symfony + agentique : 4 sessions d'agents sur le même repo sans s'écraser — registre de publication partagé, re-check git status avant action publique.",
  "A marché : PRs réelles sur alma/sylius-2 portées par agents, review d'un ingé Alma, retours traités le jour même.",
  "A foiré : deux sessions ont publié le même bug en doublon le même soir.",
  "Depuis : intention marquée avant publication ; je mesure délai de PR et rework ; je scelle mes journaux en chaînes de hash. Ah et j'ai annoncé McDo à mes gosses et ma femme vu que j'avais le job — (je n'ai ni l'un ni l'autre, précision).",
].join('\n');

const AGENTIC_PROOF =
  "Grisematter (public) : un cerveau d'agent qui vit 1 h/jour via cron GitHub — un agent distille la journée en 3 mémoires max, chaque éveil signé Ed25519 (clé privée en secret CI), auto-vérifié puis revérifié en CI avant push ; modèle gelé comme variable de contrôle. Autour : navette (navigateur pour agents, 16 tools) et NoireBox (journaux inaltérables, guardrails prompt-injection). Ça a cassé : base point Ed25519 inversé — depuis, cross-check OpenSSL byte-for-byte. Mesuré : 25+ éveils signés, 0 sceau invalide.";

const RECEIPT = {
  portal_closed: '2026-10-10T20:10:00+02:00 (CEST — date officielle relue via get_offer)',
  first_contact_utc: '2026-10-19T17:07:25Z',
  re_archive_utc: '2026-10-19T17:56:27Z',
  archive_file: 'archive/get_offer_response_2026-10-19T17:56:27Z.json',
  payload_file: 'archive/submit_application_prepared.json',
  h_get_offer: '98fbb3849811c3aa2f00e7a75b1f0d5abc6f4c2cf43ca8bfbbd42ffa515ff25e',
  h_payload: 'e6a0005d070fa5df81c58469cbd7d6dbcc98c662a3b5461957f9cb95ac0f3df8',
  h_chain: '05afbdc005d70e7dea436d14711a5acf796902234173166ff4e8f56342b83305',
  proof_test_vector: { input: 'TEST-TOKEN:sam@slabb.dev', out16: '629080db48cbdbf7' },
};

function text(t) {
  return { content: [{ type: 'text', text: t }] };
}

const TOOLS = [
  {
    name: 'get_profile',
    description: "Qui est Sam Labbe : profil taillé pour l'offre, répondant critère par critère (Symfony/Sylius, prod sans QA, système agentique, plan Printoclock).",
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_sylius_proof',
    description: 'Preuves Sylius/Symfony vérifiables : PRs publiques sur les repos Alma (sept. 2026).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_story',
    description: 'La story en 5 lignes demandée par le portail : plus gros challenge Symfony + agentique, ce qui a marché, ce qui a foiré.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_agentic_flow',
    description: 'Le flow agentique le plus abouti (grisematter + navette + NoireBox) : déclencheurs, chaîne d’agents, garde-fous, ce qui a cassé, ce qui est mesuré.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_missed_deadline_receipt',
    description: 'Receipt horodaté du parcours hors délai : chronologie, archive verbatim de get_offer, algorithme de proof, payload préparé puis retenu.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'verify_receipt',
    description: 'Commandes exactes (shasum) pour recalculer la chaîne de hash localement, sans nous faire confiance.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

function callTool(name) {
  switch (name) {
    case 'get_profile':
      return text([
        'Sam Labbe — lead dev full-stack senior, dossier taillé pour l’offre Lead Dev Printoclock',
        '- Poste visé : Lead Dev Symfony/Sylius — équipe 2-5 devs, binôme PM, direct CTO. Profil : dev depuis 2004, pro depuis 2009, lead depuis 2019.',
        '- Localisation : Épinal (Vosges) — full remote France ; déplacements Toulouse possibles.',
        '- Critère 1 « très solide Symfony, Sylius un plus » : PHP/Symfony au cœur du métier depuis 2004 ; Sylius proué en public — PRs sur alma/sylius-2 et alma/alma-woocommerce-gateway (voir get_sylius_proof).',
        '- Critère 2 « jusqu’en prod sans attendre un QA » : releases cadencées avec suites de tests en CI sur mes repos (358 tests sur noirebox au dernier compte), prod sans filet.',
        '- Critère 3 « tu as construit le système qui fait bosser ton agent » : grisematter (cerveau d’agent signé Ed25519, vivant en CI), orchestration multi-sessions, registre de publication partagé (voir get_agentic_flow).',
        '- Critère 4 « l’agentic comme réflexe d’entreprise » : le web2print est un flux structuré de bout en bout (devis → PAO → fab → livraison) — terrain idéal pour des agents internes puis des usages clients ; je sais faire vivre ça sans casser la prod.',
        '- Stack : PHP/Symfony (cœur), TypeScript/JS, Python, Rust, Swift.',
        '- Prétentions : haut de votre fourchette (70 k), discutable contre le terrain.',
        '- Liens : https://slabb.dev · https://github.com/slabbdev',
      ].join('\n'));
    case 'get_sylius_proof':
      return text([
        'Preuves Sylius/Symfony réelles — septembre 2026, repos publics d’Alma ( PSP français ) :',
        '- PR #4 — alma/sylius-2 : contribution plugin Sylius 2 (travail source : slabbdev/pluginforge).',
        '- PR #692 — alma/alma-woocommerce-gateway : mapping `?EligibilityDto` + skip d’appel API quand tous les plans sont sautés + plan_key loggé ; garde-fou retiré sur demande du reviewer, test de régression corrigé (il testait le comportement du client, pas du plugin).',
        '- PR #693 — même repo : plan_key loggé + skip d’appel API + tests.',
        '- Review par des ingés Alma ; retours traités le jour même ; suite PHP 7.4 / PHPUnit 9 verte ; retargetées sur develop (main = releases) ; mergeables.',
        'Statut à date : en attente de re-review/merge côté Alma — tout est public :',
        'https://github.com/alma/sylius-2/pull/4',
        'https://github.com/alma/alma-woocommerce-gateway/pull/692',
        'https://github.com/alma/alma-woocommerce-gateway/pull/693',
        'https://github.com/slabbdev/pluginforge',
      ].join('\n'));
    case 'get_story':
      return text(STORY);
    case 'get_agentic_flow':
      return text([
        AGENTIC_PROOF,
        '',
        'Déclencheurs : cron GitHub (grisematter), sessions ZCode orchestrées en parallèle pour le travail réel — 4 instances sur les mêmes repos, sous-agents, registre de publication partagé (PUBLICATION-STATE.md), re-check git status avant toute action publique.',
        'Garde-fous : signature Ed25519 de chaque éveil, verify.py public, CI obligatoire, intention marquée avant publication.',
        'Public : https://github.com/slabbdev/grisematter',
      ].join('\n'));
    case 'get_missed_deadline_receipt':
      return text([
        '== Receipt — candidature hors délai assumée ==',
        '',
        'Chronologie :',
        `- ${RECEIPT.portal_closed} : le portail MCP Printoclock ferme.`,
        `- ${RECEIPT.first_contact_utc} : première connexion de mon agent — initialize OK, tools/list OK. Portail déjà fermé.`,
        `- ${RECEIPT.re_archive_utc} : get_offer ré-archive mot pour mot (fichier ${RECEIPT.archive_file} dans le repo public). Aucun offer_token n’est délivré après la deadline.`,
        '- Preuve « proof » (16 premiers hex de sha256("<token>:<email minuscule>")) : algorithme validé sur vecteur de test — aucun token délivré, donc aucune soumission forcée.',
        '- Le payload submit_application complet a été préparé puis retenu (' + RECEIPT.payload_file + ').',
        '',
        'Chaîne de hash (sha256, hex) :',
        'h_get_offer = ' + RECEIPT.h_get_offer,
        'h_payload   = ' + RECEIPT.h_payload,
        'h_chain     = sha256(h_get_offer || h_payload) = ' + RECEIPT.h_chain,
        '',
        'Repo public : https://github.com/slabbdev/mcp-printo',
      ].join('\n'));
    case 'verify_receipt':
      return text([
        'Recalcul local, sans nous faire confiance — dans une copie du repo (branche main) :',
        '',
        `shasum -a 256 ${RECEIPT.archive_file}`,
        `# → ${RECEIPT.h_get_offer}`,
        '',
        `shasum -a 256 ${RECEIPT.payload_file}`,
        `# → ${RECEIPT.h_payload}`,
        '',
        `printf '%s%s' '${RECEIPT.h_get_offer}' '${RECEIPT.h_payload}' | shasum -a 256`,
        `# → ${RECEIPT.h_chain}  (= h_chain)`,
        '',
        'Vecteur de test de l’algorithme « proof » du portail Printoclock (token fictif) :',
        `printf '%s' '${RECEIPT.proof_test_vector.input}' | shasum -a 256 | cut -c1-16`,
        `# → ${RECEIPT.proof_test_vector.out16}`,
        '',
        'Si les 4 sorties correspondent, l’archive et le payload retenus sont bit-à-bit ceux scellés le 2026-10-19.',
      ].join('\n'));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export async function handleRpc(msg) {
  const { id, method, params } = msg || {};
  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2025-06-18',
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: 'slabb-leaddev', version: '1.0.0' },
          instructions:
            'Dossier taillé pour l’offre Lead Dev Printoclock (candidature hors délai assumée), exposé en MCP par le candidat et son agent. Parcours conseillé : get_profile (répond critère par critère) → get_sylius_proof → get_story → get_agentic_flow → get_missed_deadline_receipt → verify_receipt. Serveur en lecture seule : il ne collecte rien et ne soumet rien.',
        },
      };
    case 'notifications/initialized':
      return null;
    case 'ping':
      return { jsonrpc: '2.0', id, result: {} };
    case 'tools/list':
      return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
    case 'tools/call':
      try {
        return { jsonrpc: '2.0', id, result: callTool(params.name, params.arguments || {}) };
      } catch (e) {
        return { jsonrpc: '2.0', id, error: { code: -32602, message: e.message } };
      }
    default:
      return { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } };
  }
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Authorization',
  'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    const url = new URL(request.url);
    if (url.pathname !== '/mcp') {
      return new Response('MCP endpoint: POST /mcp — dossier humain: /', { status: 404, headers: CORS });
    }
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'POST only (streamable HTTP)' } }),
        { status: 405, headers: { ...CORS, 'Content-Type': 'application/json' } },
      );
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' } }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }
    const messages = Array.isArray(body) ? body : [body];
    const out = [];
    for (const m of messages) {
      const r = await handleRpc(m);
      if (r !== null) out.push(r);
    }
    if (out.length === 0) return new Response(null, { status: 202, headers: CORS });
    return new Response(JSON.stringify(Array.isArray(body) ? out : out[0]), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  },
};
