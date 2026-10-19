# mcp-printo — candidature hors délai, exposée en MCP

Dossier de candidature au poste **Lead Dev Symfony / Sylius** de PrintOclock (fermeture du portail : 10/10/2026 20h10 CEST ; découverte de l'annonce : 19/10/2026). Le parcours officiel a été exécuté par l'agent puis interrompu proprement devant la porte fermée — archive verbatim, preuve calculée sur vecteur de test, payload retenu, chaîne de hash vérifiable.

## Architecture (zéro serveur)

```
                    mcp-printo.slabb.dev
                    (zone Cloudflare de slabb.dev, proxy orange)
                   /                                  \
   mcp-printo.slabb.dev/mcp*                 mcp-printo.slabb.dev/*
   → Worker Cloudflare (gratuit)             → GitHub Pages (ce repo, index.html)
     JSON-RPC stateless, lecture seule         vitrine humaine
```

- Le contenu vit **dans ce repo** (source de vérité + GitHub Pages).
- Le Worker ne fait que router le JSON-RPC : aucune donnée, aucune base, rien à maintenir.
- Pages seul ne peut pas servir de MCP (GET only ; le transport streamable HTTP exige du POST).

## Contenu

| Chemin | Rôle |
|---|---|
| `index.html` | Vitrine humaine (GitHub Pages, racine) |
| `worker/worker.js` | Router MCP (6 outils, stateless, lecture seule) |
| `worker/wrangler.toml` | Config Worker + route `mcp-printo.slabb.dev/mcp*` |
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

## Runbook de mise en ligne (ordre obligatoire)

1. **Local** : `node tools/selftest.mjs` → 20/20 PASS.
2. **Push** du repo sur `slabbdev/mcp-printo` (public).
3. **GitHub Pages** : Settings → Pages → Deploy from branch `main` / racine → domaine custom `mcp-printo.slabb.dev` (le fichier `CNAME` est déjà là).
4. **DNS (à Sam)** : dans la zone `slabb.dev` → enregistrement `CNAME mcp-printo → slabbdev.github.io`, **proxy orange activé**, SSL/TLS en `Full`. (Prérequis : zone `slabb.dev` sur Cloudflare. Sinon, fallback : supprimer `routes` du `wrangler.toml`, déployer sur `workers.dev`, et mettre à jour l'URL dans la vitrine + l'email.)
5. **Worker** : `wrangler login && wrangler deploy` (la route est créée automatiquement), ou laisser la GitHub Action (`secrets`: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).
6. **Preuve live** : `bash tools/selftest-curl.sh https://mcp-printo.slabb.dev/mcp` → 12/12 PASS **avant** d'envoyer le moindre email.
7. **Email** : envoyer `EMAIL.md` à jlestel@printoclock.com.

## Test local

```bash
node tools/selftest.mjs        # router + chaîne de hash, 15 checks
```
