#!/bin/bash
set -e
DIR="/c/Users/archi/Desktop/CLAUDE/WEBSITE/shopify-assets"
TARGET="https://shopify-staged-uploads.storage.googleapis.com/"

echo "Uploading 1.jpg..."
curl -s -o /dev/null -w "1.jpg -> %{http_code}\n" -X POST "$TARGET" \
  -F "Content-Type=image/jpeg" \
  -F "success_action_status=201" \
  -F "acl=private" \
  -F "key=tmp/102163054979/products/ebb67212-88a0-4a75-b39b-3e2741047b0e/moonbites-product-1.jpg" \
  -F "x-goog-date=20260614T201040Z" \
  -F "x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/20260614/auto/storage/goog4_request" \
  -F "x-goog-algorithm=GOOG4-RSA-SHA256" \
  -F "x-goog-signature=afb0511138bf5c425f0e03bcc13d7dfcc4a3673b991e783babcb919f4bc44665fbb3c78106e74e62421cfc0625e6a65fdb96d5a91ed489d784a434c3db360e211e69b476db174dc9ab468a780aa2dffb9eb5e45a2a779fd10359cd2a198ba48bb5bf76443be4dd72ec0afef07be8728831a55ec8cb8552fd52eeabd5976f279eb13f445b6a989c8d197ec28529539a1eb63d1d36b156a55b57633c8aac8098c15b19efcbb8114a471c8764b14effa76f8ef141b868f63e46ac8aeb9869e6525cb2dbe0ffa1938a528a32a9438c2ef91879e50c2df63d17f0811c3f45c15812f647defa874d6727fe2823d55c53ff25f1435b5abe36218515e6779dd494d65a2f" \
  -F "policy=eyJjb25kaXRpb25zIjpbeyJDb250ZW50LVR5cGUiOiJpbWFnZVwvanBlZyJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0seyJhY2wiOiJwcml2YXRlIn0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwyMDk3MTUyMF0seyJidWNrZXQiOiJzaG9waWZ5LXN0YWdlZC11cGxvYWRzIn0seyJrZXkiOiJ0bXBcLzEwMjE2MzA1NDk3OVwvcHJvZHVjdHNcL2ViYjY3MjEyLTg4YTAtNGE3NS1iMzliLTNlMjc0MTA0N2IwZVwvbW9vbmJpdGVzLXByb2R1Y3QtMS5qcGcifSx7IngtZ29vZy1kYXRlIjoiMjAyNjA2MTRUMjAxMDQwWiJ9LHsieC1nb29nLWNyZWRlbnRpYWwiOiJtZXJjaGFudC1hc3NldHNAc2hvcGlmeS10aWVycy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbVwvMjAyNjA2MTRcL2F1dG9cL3N0b3JhZ2VcL2dvb2c0X3JlcXVlc3QifSx7IngtZ29vZy1hbGdvcml0aG0iOiJHT09HNC1SU0EtU0hBMjU2In1dLCJleHBpcmF0aW9uIjoiMjAyNi0wNi0xNVQyMDoxMDo0MFoifQ==" \
  -F "file=@$DIR/1.jpg"

echo "Uploading 2.jpg..."
curl -s -o /dev/null -w "2.jpg -> %{http_code}\n" -X POST "$TARGET" \
  -F "Content-Type=image/jpeg" \
  -F "success_action_status=201" \
  -F "acl=private" \
  -F "key=tmp/102163054979/products/c960ff74-95ff-4420-a879-0b52a4171ae2/moonbites-benefits.jpg" \
  -F "x-goog-date=20260614T201040Z" \
  -F "x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/20260614/auto/storage/goog4_request" \
  -F "x-goog-algorithm=GOOG4-RSA-SHA256" \
  -F "x-goog-signature=59b511b08c2aa039ecfde6172009241e2eb137b819c417c690a7d12950605a12784faa57ebacc35a61133b6a79d4ec206cbf3de0ac409637eba63de66e7cf96253f6c0c92d9d7d522e3caaf66798995a5f71421a82fb354914afe0210bbf721a7b50ab7c702a80ae355cadfe2d3a5c830ee89b8c6e62b32dade35bcdf99746b959ade88c6862a1de141e81bd5aa60a14d1296c52b75cb0aa73eb174b5dbb5616bb87cc83419270d5c07d1eca24d977b3fce503a52bda16eae494a9cc18c51148d4e618f229732b5eefaad0f7021c53aed08b94372fe6dc900cc71756309df0c0afb9e459c1cd542228f8be548cf92c3548c7a94622a1e3683f724c7b6e1639bc" \
  -F "policy=eyJjb25kaXRpb25zIjpbeyJDb250ZW50LVR5cGUiOiJpbWFnZVwvanBlZyJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0seyJhY2wiOiJwcml2YXRlIn0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwyMDk3MTUyMF0seyJidWNrZXQiOiJzaG9waWZ5LXN0YWdlZC11cGxvYWRzIn0seyJrZXkiOiJ0bXBcLzEwMjE2MzA1NDk3OVwvcHJvZHVjdHNcL2M5NjBmZjc0LTk1ZmYtNDQyMC1hODc5LTBiNTJhNDE3MWFlMlwvbW9vbmJpdGVzLWJlbmVmaXRzLmpwZyJ9LHsieC1nb29nLWRhdGUiOiIyMDI2MDYxNFQyMDEwNDBaIn0seyJ4LWdvb2ctY3JlZGVudGlhbCI6Im1lcmNoYW50LWFzc2V0c0BzaG9waWZ5LXRpZXJzLmlhbS5nc2VydmljZWFjY291bnQuY29tXC8yMDI2MDYxNFwvYXV0b1wvc3RvcmFnZVwvZ29vZzRfcmVxdWVzdCJ9LHsieC1nb29nLWFsZ29yaXRobSI6IkdPT0c0LVJTQS1TSEEyNTYifV0sImV4cGlyYXRpb24iOiIyMDI2LTA2LTE1VDIwOjEwOjQwWiJ9" \
  -F "file=@$DIR/2.jpg"

echo "Uploading 4.jpg..."
curl -s -o /dev/null -w "4.jpg -> %{http_code}\n" -X POST "$TARGET" \
  -F "Content-Type=image/jpeg" \
  -F "success_action_status=201" \
  -F "acl=private" \
  -F "key=tmp/102163054979/products/4e944196-0dfa-4120-b7f4-bfa295add64a/moonbites-how-it-works.jpg" \
  -F "x-goog-date=20260614T201040Z" \
  -F "x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/20260614/auto/storage/goog4_request" \
  -F "x-goog-algorithm=GOOG4-RSA-SHA256" \
  -F "x-goog-signature=0dd522bd94c51302016c5818432f7aa3802703cac603113bc83a2e13c385a27539215159ca8295030e5eea351c61db48d7f904ab9b64c225a2ea3b9e63b9f0a8cfe217e0cad41a336d513b5f745fd870c614a7a806e36204ae71f995202a85c7d45e8e2b1b66af7e872e59f20274762ba24f71e951fcc1589f100dcaac00fe937253c6999da3a30bd741761adc63ab57e5ae479853aca880ef34a2a0ef497fd5884cd6b1456f719b548be0f5e6de52820d31dd5fe82d064f2bf35475c124b828ca36997ad4f1e79f3b5edbe17783fc7582b97dcfa7b516c530ff739d3f2e212e8dc8d2e2f27dc5ad56210bdd62947f2b7595a14f5a9532bde7dbf93fbe9e2191" \
  -F "policy=eyJjb25kaXRpb25zIjpbeyJDb250ZW50LVR5cGUiOiJpbWFnZVwvanBlZyJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0seyJhY2wiOiJwcml2YXRlIn0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwyMDk3MTUyMF0seyJidWNrZXQiOiJzaG9waWZ5LXN0YWdlZC11cGxvYWRzIn0seyJrZXkiOiJ0bXBcLzEwMjE2MzA1NDk3OVwvcHJvZHVjdHNcLzRlOTQ0MTk2LTBkZmEtNDEyMC1iN2Y0LWJmYTI5NWFkZDY0YVwvbW9vbmJpdGVzLWhvdy1pdC13b3Jrcy5qcGcifSx7IngtZ29vZy1kYXRlIjoiMjAyNjA2MTRUMjAxMDQwWiJ9LHsieC1nb29nLWNyZWRlbnRpYWwiOiJtZXJjaGFudC1hc3NldHNAc2hvcGlmeS10aWVycy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbVwvMjAyNjA2MTRcL2F1dG9cL3N0b3JhZ2VcL2dvb2c0X3JlcXVlc3QifSx7IngtZ29vZy1hbGdvcml0aG0iOiJHT09HNC1SU0EtU0hBMjU2In1dLCJleHBpcmF0aW9uIjoiMjAyNi0wNi0xNVQyMDoxMDo0MFoifQ==" \
  -F "file=@$DIR/4.jpg"

echo "Uploading 6.jpg..."
curl -s -o /dev/null -w "6.jpg -> %{http_code}\n" -X POST "$TARGET" \
  -F "Content-Type=image/jpeg" \
  -F "success_action_status=201" \
  -F "acl=private" \
  -F "key=tmp/102163054979/products/6c9daa80-6c71-488f-a45d-a9f3125a6e53/moonbites-hero.jpg" \
  -F "x-goog-date=20260614T201040Z" \
  -F "x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/20260614/auto/storage/goog4_request" \
  -F "x-goog-algorithm=GOOG4-RSA-SHA256" \
  -F "x-goog-signature=4541ccf4e8478ed259f25a8d1acf5c94f631c9de3e71784984a85fa3f412d0a07e665f66fbc7ce427fecf7654b0d22d85f2d5bc5f91ed78bd9defce424ade947a01cddac38a2b3aa866676e2010156ac70ea759c490fb086d143cfd1030700b2057e957f45779136e4922b3ca13d250ba006f230cd71b3e3633a58a7ac0d92c52959b9d2d456c4290d84c497ec901ca2c07a2158d290deec4df0b08cf96e952f816c31bddc4d23ea984ac6de6f1fb4536b54f2eb150c2ff0f58427233937da115dfcaba4760da3bcf6a0fd9ac8c98c95e9ff59e66813723ef3575e39967c456c07b86c4b00c83ee2ee31d015c6caa2e18d4e86c836676ab47393fcc4d49f9a0a" \
  -F "policy=eyJjb25kaXRpb25zIjpbeyJDb250ZW50LVR5cGUiOiJpbWFnZVwvanBlZyJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0seyJhY2wiOiJwcml2YXRlIn0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwyMDk3MTUyMF0seyJidWNrZXQiOiJzaG9waWZ5LXN0YWdlZC11cGxvYWRzIn0seyJrZXkiOiJ0bXBcLzEwMjE2MzA1NDk3OVwvcHJvZHVjdHNcLzZjOWRhYTgwLTZjNzEtNDg4Zi1hNDVkLWE5ZjMxMjVhNmU1M1wvbW9vbmJpdGVzLWhlcm8uanBnIn0seyJ4LWdvb2ctZGF0ZSI6IjIwMjYwNjE0VDIwMTA0MFoifSx7IngtZ29vZy1jcmVkZW50aWFsIjoibWVyY2hhbnQtYXNzZXRzQHNob3BpZnktdGllcnMuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb21cLzIwMjYwNjE0XC9hdXRvXC9zdG9yYWdlXC9nb29nNF9yZXF1ZXN0In0seyJ4LWdvb2ctYWxnb3JpdGhtIjoiR09PRzQtUlNBLVNIQTI1NiJ9XSwiZXhwaXJhdGlvbiI6IjIwMjYtMDYtMTVUMjA6MTA6NDBaIn0=" \
  -F "file=@$DIR/6.jpg"

echo "Uploading logo-icon.png..."
curl -s -o /dev/null -w "logo-icon.png -> %{http_code}\n" -X POST "$TARGET" \
  -F "Content-Type=image/png" \
  -F "success_action_status=201" \
  -F "acl=private" \
  -F "key=tmp/102163054979/products/a579fb9a-984f-4630-84af-b77782ee9f46/moonbites-logo-icon.png" \
  -F "x-goog-date=20260614T201040Z" \
  -F "x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/20260614/auto/storage/goog4_request" \
  -F "x-goog-algorithm=GOOG4-RSA-SHA256" \
  -F "x-goog-signature=4718b47fd5ff9fbc73f9bd84da9a366f125a258e1a5070115e59b391a230aada49e53eb9eb34f9c5219b596b41a619d6af0c345c8c1b55606d5b39e2e6d21ab4508f7eeb4d9ee3dd70b1fc6c044015da1f828ad826514945794610901148d9c729d48511de717c3701aa85875005a2dd8c2088719ea40283fcef539c004cd265d9123cff442bdcc1f56c7e347adfc84fb43ac60fef38f00245684961bff211f334a572a0c8f7752ba0d92d5974b0084f6653d2220c847e88fd363bcacf470df3ff83301773da98c75c95fb3eee3d14a967a2c6d12f7c86d3f773ec5f6bdcc64659c195ab20f3441a8162e72baac407078f4327cbe647a7e703f8ef8d1ffebfd3" \
  -F "policy=eyJjb25kaXRpb25zIjpbeyJDb250ZW50LVR5cGUiOiJpbWFnZVwvcG5nIn0seyJzdWNjZXNzX2FjdGlvbl9zdGF0dXMiOiIyMDEifSx7ImFjbCI6InByaXZhdGUifSxbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwxLDIwOTcxNTIwXSx7ImJ1Y2tldCI6InNob3BpZnktc3RhZ2VkLXVwbG9hZHMifSx7ImtleSI6InRtcFwvMTAyMTYzMDU0OTc5XC9wcm9kdWN0c1wvYTU3OWZiOWEtOTg0Zi00NjMwLTg0YWYtYjc3NzgyZWU5ZjQ2XC9tb29uYml0ZXMtbG9nby1pY29uLnBuZyJ9LHsieC1nb29nLWRhdGUiOiIyMDI2MDYxNFQyMDEwNDBaIn0seyJ4LWdvb2ctY3JlZGVudGlhbCI6Im1lcmNoYW50LWFzc2V0c0BzaG9waWZ5LXRpZXJzLmlhbS5nc2VydmljZWFjY291bnQuY29tXC8yMDI2MDYxNFwvYXV0b1wvc3RvcmFnZVwvZ29vZzRfcmVxdWVzdCJ9LHsieC1nb29nLWFsZ29yaXRobSI6IkdPT0c0LVJTQS1TSEEyNTYifV0sImV4cGlyYXRpb24iOiIyMDI2LTA2LTE1VDIwOjEwOjQwWiJ9" \
  -F "file=@$DIR/logo-icon.png"

echo "Done."
