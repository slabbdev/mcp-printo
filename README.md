# mcp-printo — candidature hors délai, exposée en MCP

Dossier de candidature au poste **Lead Dev Symfony / Sylius** de PrintOclock (fermeture du portail : 10/10/2026 20h10 CEST ; découverte de l'annonce : 19/10/2026). Le parcours officiel a été exécuté par l'agent puis interrompu proprement devant la porte fermée — archive verbatim, preuve calculée sur vecteur de test, payload retenu, chaîne de hash vérifiable.

## Architecture (zéro serveur)

```
  https://slabb-leaddev-mcp.slabbdev.workers.dev/mcp      https://mcp-printo.slabb.dev/
  → Worker Cloudflare (JSON-RPC stateless, lecture seule)  → GitHub Pages (ce repo, index.html)
    déployé par API CF (compte slabbdev.workers.dev)         vitrine humaine (DNS Spaceship :
                                                             mcp-printo CNAME slabbdev.github.io)
```

- Le contenu vit **dans ce repo** (source de vérité + GitHub Pages).
- Le Worker ne fait que router le JSON-RPC : aucune donnée, aucune base, rien à maintenir.
- La zone `slabb.dev` est chez Spaceship (pas Cloudflare) → pas de route `mcp-printo.slabb.dev/mcp*`
  possible ; le MCP vit sur workers.dev. Pages seul ne peut pas servir de MCP
  (GET only ; le transport streamable HTTP exige du POST).

## Contenu

| Chemin | Rôle |
|---|---|
| `index.html` | Vitrine humaine (GitHub Pages, racine) |
| `worker/worker.js` | Router MCP (6 outils, stateless, lecture seule) |
| `worker/wrangler.toml` | Config Worker (nom, module, compat date) |
| `archive/get_offer_response_2026-10-19T17:56:27Z.json` | Réponse `get_offer` verbatim (3 095 octets) |
| `archive/submit_application_prepared.json` | Payload `submit_application` préparé puis retenu |
| `tools/selftest.mjs` | 20 checks du router en node local |
| `tools/selftest-curl.sh` | Preuve live post-déploiement (curl contre l'URL publique) — 12 checks |
| `tools/local-server.mjs` | Serveur HTTP local qui embarque le Worker (test de bout en bout sans déployer) |
| `EMAIL.md` | Brouillon de l'email au CTO (à n'envoyer qu'après la mise en ligne) |
| `CNAME` | Domaine custom Pages : `mcp-printo.slabb.dev` |

## Chaîne de hash (scellée le 2026-10-19)

```
h_get_offer = 98fbb3849811c3aa2f00e7a75b1f0d5abc6f4c2cf43ca8bfbbd42ffa515ff25e
h_payload   = e6a0005d070fa5df81c58469cbd7d6dbcc98c662a3b5461957f9cb95ac0f3df8
h_chain     = sha256(h_get_offer ‖ h_payload) = 05afbdc005d70e7dea436d14711a5acf796902234173166ff4e8f56342b83305
```

⚠️ **Tout fichier modifié dans `archive/` casse la chaîne** — les constantes du Worker et de la vitrine ne correspondraient plus (le selftest le détecte).

## Runbook (état au 2026-10-19)

1. ~~Local~~ ✅ 20/20 PASS (`node tools/selftest.mjs`).
2. ~~Push~~ ✅ repo public `slabbdev/mcp-printo`.
3. ~~GitHub Pages~~ ✅ activé, cname `mcp-printo.slabb.dev` posé côté repo.
4. **DNS (à Sam, chez Spaceship)** : `mcp-printo` CNAME `slabbdev.github.io` → la vitrine passe en https://mcp-printo.slabb.dev/ (cert GitHub auto).
5. ~~Worker~~ ✅ déployé par API CF : `https://slabb-leaddev-mcp.slabbdev.workers.dev/mcp`.
6. ~~Preuve live~~ ✅ 12/12 PASS contre l'URL publique.
7. **Email** : envoyer `EMAIL.md` à jlestel@printoclock.com (après étape 4).

## Test local

```bash
node tools/selftest.mjs        # router + chaîne de hash, 15 checks
```
