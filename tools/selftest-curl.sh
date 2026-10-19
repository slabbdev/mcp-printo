# Preuve live post-déploiement — `bash tools/selftest-curl.sh [url]`
URL="${1:-https://mcp-printo.slabb.dev/mcp}"
H=(-H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream')
pass=0; fail=0
ok() { if [ "$1" = "0" ]; then pass=$((pass+1)); echo "PASS — $2"; else fail=$((fail+1)); echo "FAIL — $2"; fi; }

post() { curl -sS --max-time 20 -X POST "$URL" "${H[@]}" -d "$1"; }

R=$(post '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"live-proof","version":"1.0"}}}')
echo "$R" | grep -q '"slabb-leaddev"'; ok $? 'initialize → serverInfo'

R=$(post '{"jsonrpc":"2.0","id":2,"method":"tools/list"}')
echo "$R" | grep -q 'get_missed_deadline_receipt'; ok $? 'tools/list → 6 tools'

for t in get_profile get_sylius_proof get_story get_agentic_flow get_missed_deadline_receipt verify_receipt; do
  R=$(post "{\"jsonrpc\":\"2.0\",\"id\":3,\"method\":\"tools/call\",\"params\":{\"name\":\"$t\",\"arguments\":{}}}")
  echo "$R" | grep -q '"text"'; ok $? "tools/call $t"
done

R=$(post '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"nope","arguments":{}}}')
echo "$R" | grep -q '\-32602'; ok $? 'tool inconnu → -32602'

R=$(post '{"jsonrpc":"2.0","id":5,"method":"nope"}')
echo "$R" | grep -q '\-32601'; ok $? 'méthode inconnue → -32601'

R=$(post 'not json')
echo "$R" | grep -q '\-32700'; ok $? 'JSON invalide → -32700'

CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$URL")
[ "$CODE" = "405" ]; ok $? "GET → 405 (POST only)"

echo ""
echo "$pass/$((pass+fail)) PASS contre $URL"
[ "$fail" = "0" ]
