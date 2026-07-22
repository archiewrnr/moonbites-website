#!/bin/bash
set -e
cd "$(dirname "$0")"

curl -s -o /dev/null -w "moonbites.css: %{http_code}\n" \
  -X POST "https://shopify-staged-uploads.storage.googleapis.com/" \
  -F "Content-Type=text/css" \
  -F "success_action_status=201" \
  -F "acl=private" \
  -F "key=tmp/102163054979/files/733de9e2-5fd6-4b7b-98ab-10efbdf7d08f/moonbites.css" \
  -F "x-goog-date=20260614T202307Z" \
  -F "x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/20260614/auto/storage/goog4_request" \
  -F "x-goog-algorithm=GOOG4-RSA-SHA256" \
  -F "x-goog-signature=555963b5f8fbea6e784e8a48c5780fbfb4604fd5f2181f177867a567f39243c86666ff425876d3bbcbc722b73625ec9aa42f51b7a16421d5d870c1f5849c59bffe072e835a271e38ef11c9404fdf419a5cb0696bbd45949726f4ab91db32dd24c315406c9b5bee92175f2677c57c9ac71d7b6ce34a3fd82f3545776d820e7ed7a6e3191c8c353e0c698c878dff1ae0df2adbdea64bf861e262e0f76e646a626626734fb4d0aa9787f39ff7aab6be6b2dcbbdc68ea8769bbaadd0ef6b9a143236bea06c8ac77c3e61b70e90a57707de287a587e36586a1a3f391cd923534bc7c2e550c457e45274277a509ed0c6e1e58c83eacc54d23df128b6550708d882f9bf" \
  -F "policy=eyJjb25kaXRpb25zIjpbeyJDb250ZW50LVR5cGUiOiJ0ZXh0XC9jc3MifSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9LHsiYWNsIjoicHJpdmF0ZSJ9LFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDEsMjA5NzE1MjBdLHsiYnVja2V0Ijoic2hvcGlmeS1zdGFnZWQtdXBsb2FkcyJ9LHsia2V5IjoidG1wXC8xMDIxNjMwNTQ5NzlcL2ZpbGVzXC83MzNkZTllMi01ZmQ2LTRiN2ItOThhYi0xMGVmYmRmN2QwOGZcL21vb25iaXRlcy5jc3MifSx7IngtZ29vZy1kYXRlIjoiMjAyNjA2MTRUMjAyMzA3WiJ9LHsieC1nb29nLWNyZWRlbnRpYWwiOiJtZXJjaGFudC1hc3NldHNAc2hvcGlmeS10aWVycy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbVwvMjAyNjA2MTRcL2F1dG9cL3N0b3JhZ2VcL2dvb2c0X3JlcXVlc3QifSx7IngtZ29vZy1hbGdvcml0aG0iOiJHT09HNC1SU0EtU0hBMjU2In1dLCJleHBpcmF0aW9uIjoiMjAyNi0wNi0xNVQyMDoyMzowN1oifQ==" \
  -F "file=@moonbites.css"

curl -s -o /dev/null -w "moonbites.js: %{http_code}\n" \
  -X POST "https://shopify-staged-uploads.storage.googleapis.com/" \
  -F "Content-Type=application/javascript" \
  -F "success_action_status=201" \
  -F "acl=private" \
  -F "key=tmp/102163054979/files/d24dd260-c250-4839-929f-dd3270ec2b9d/moonbites.js" \
  -F "x-goog-date=20260614T202307Z" \
  -F "x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/20260614/auto/storage/goog4_request" \
  -F "x-goog-algorithm=GOOG4-RSA-SHA256" \
  -F "x-goog-signature=518f2c7cb5bbec7ebd484746cd9d5f9cddf5067587987fa5a550c3574f20bbca35b00f8586c7a256aaa5861d134acd499d92efaf80db752fe5d24999fdb9740b1fc04b6b36b9d2e96f591a2ccbdc167091cfa342c76f52e08f0c12cc4ae94076da0622a01b589d0a284c7021f1416f77ccff1e510e94cad534d3093fc5fce76a35783ebd7c0ea74192396cb77ed1288f320acf6cd619e675967c7d0f44b6e7206a483901ca755e935df4d5e4e86ed1a4549bbdf4ef10e6d3a4eaf022b43382c787c90f085c57b97f5fbe2814ec4a37e8cbfb31bc8ddc47fc03bb9f8199c75cdc7dce85d46298a5898ff4f2774b4f802afe5c645e0dea09ab64e100d77ff1bd1c" \
  -F "policy=eyJjb25kaXRpb25zIjpbeyJDb250ZW50LVR5cGUiOiJhcHBsaWNhdGlvblwvamF2YXNjcmlwdCJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0seyJhY2wiOiJwcml2YXRlIn0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwyMDk3MTUyMF0seyJidWNrZXQiOiJzaG9waWZ5LXN0YWdlZC11cGxvYWRzIn0seyJrZXkiOiJ0bXBcLzEwMjE2MzA1NDk3OVwvZmlsZXNcL2QyNGRkMjYwLWMyNTAtNDgzOS05MjlmLWRkMzI3MGVjMmI5ZFwvbW9vbmJpdGVzLmpzIn0seyJ4LWdvb2ctZGF0ZSI6IjIwMjYwNjE0VDIwMjMwN1oifSx7IngtZ29vZy1jcmVkZW50aWFsIjoibWVyY2hhbnQtYXNzZXRzQHNob3BpZnktdGllcnMuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb21cLzIwMjYwNjE0XC9hdXRvXC9zdG9yYWdlXC9nb29nNF9yZXF1ZXN0In0seyJ4LWdvb2ctYWxnb3JpdGhtIjoiR09PRzQtUlNBLVNIQTI1NiJ9XSwiZXhwaXJhdGlvbiI6IjIwMjYtMDYtMTVUMjA6MjM6MDdaIn0=" \
  -F "file=@moonbites.js"

curl -s -o /dev/null -w "moonbites-layout.liquid: %{http_code}\n" \
  -X POST "https://shopify-staged-uploads.storage.googleapis.com/" \
  -F "Content-Type=text/plain" \
  -F "success_action_status=201" \
  -F "acl=private" \
  -F "key=tmp/102163054979/files/323b4e63-f465-49cb-bc04-4a8e7dc32ef9/moonbites-layout.liquid" \
  -F "x-goog-date=20260614T202307Z" \
  -F "x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/20260614/auto/storage/goog4_request" \
  -F "x-goog-algorithm=GOOG4-RSA-SHA256" \
  -F "x-goog-signature=7f5ae565a985e46ca18717cdc0affc4be081de0d9768c657c308efd4706160fd2964fe6bd8d849473cfbd75aa6cff97b0b3c4968690b476ccdc413bb440fb9109ef1774e3495c919c70dbc0ebedbd1e555a52ffd5a739afa1bc4e4001b2501ee80d18313220e5300d977935145a18f5fdddb63e8450593324d20cbffd8aa75ea63259eab83c29a9d9c24e45c29e99106a40d27f9f3205955161bf89532f93eeb98e48cee91afe5fb9faa7f2e2ff4ec5d18fb49cb5bda6a8be39a2c2f8a7e693b2deb312eb6e82b9df2c8c81e31e0724d5e6ada87d58ea2fc1cdc4d8b2116ce82bc35ff8b228e61ef888a5a5f6f6b576cc71bb7e9b747fdbbeb7c88f9ad00e1d6" \
  -F "policy=eyJjb25kaXRpb25zIjpbeyJDb250ZW50LVR5cGUiOiJ0ZXh0XC9wbGFpbiJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0seyJhY2wiOiJwcml2YXRlIn0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwyMDk3MTUyMF0seyJidWNrZXQiOiJzaG9waWZ5LXN0YWdlZC11cGxvYWRzIn0seyJrZXkiOiJ0bXBcLzEwMjE2MzA1NDk3OVwvZmlsZXNcLzMyM2I0ZTYzLWY0NjUtNDljYi1iYzA0LTRhOGU3ZGMzMmVmOVwvbW9vbmJpdGVzLWxheW91dC5saXF1aWQifSx7IngtZ29vZy1kYXRlIjoiMjAyNjA2MTRUMjAyMzA3WiJ9LHsieC1nb29nLWNyZWRlbnRpYWwiOiJtZXJjaGFudC1hc3NldHNAc2hvcGlmeS10aWVycy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbVwvMjAyNjA2MTRcL2F1dG9cL3N0b3JhZ2VcL2dvb2c0X3JlcXVlc3QifSx7IngtZ29vZy1hbGdvcml0aG0iOiJHT09HNC1SU0EtU0hBMjU2In1dLCJleHBpcmF0aW9uIjoiMjAyNi0wNi0xNVQyMDoyMzowN1oifQ==" \
  -F "file=@moonbites-layout.liquid"

curl -s -o /dev/null -w "index.liquid: %{http_code}\n" \
  -X POST "https://shopify-staged-uploads.storage.googleapis.com/" \
  -F "Content-Type=text/plain" \
  -F "success_action_status=201" \
  -F "acl=private" \
  -F "key=tmp/102163054979/files/6f9afec0-1c80-4364-b03a-03b9b461e185/index.liquid" \
  -F "x-goog-date=20260614T202307Z" \
  -F "x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/20260614/auto/storage/goog4_request" \
  -F "x-goog-algorithm=GOOG4-RSA-SHA256" \
  -F "x-goog-signature=727ce43cff46fe1d0fa38b97771806d6df844ffb5848b82d1ad3d20aa8bf404dba7b9faacaf49e28b6fd5a12b21192d4a5e35b2f07b6fdcb14c055b20f2ddd0a0cee851a625e3f993920ffa7bae32ecfcbfd15b5475044d40e8d463978dae8d644c1c97fef54ab65363215c45211e75ec04d5e32cb195f0c2b8cd7541ef3250282855c4318923dd8e20839f6196310ea423dd954d541f0e562857fecdf5584a417811a22fd09a423a7377f9cddbfa72326804244959aca6d36f78feeace97f45c897a5c02f419a698ecd4243a073fb47ab6d49a782a4fc96bd8153b5b51a6cae6d94189fb48629b2fb50c65dbae998e6fc1cad78a09bd48d373f2e2b58f23fcc" \
  -F "policy=eyJjb25kaXRpb25zIjpbeyJDb250ZW50LVR5cGUiOiJ0ZXh0XC9wbGFpbiJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0seyJhY2wiOiJwcml2YXRlIn0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwyMDk3MTUyMF0seyJidWNrZXQiOiJzaG9waWZ5LXN0YWdlZC11cGxvYWRzIn0seyJrZXkiOiJ0bXBcLzEwMjE2MzA1NDk3OVwvZmlsZXNcLzZmOWFmZWMwLTFjODAtNDM2NC1iMDNhLTAzYjliNDYxZTE4NVwvaW5kZXgubGlxdWlkIn0seyJ4LWdvb2ctZGF0ZSI6IjIwMjYwNjE0VDIwMjMwN1oifSx7IngtZ29vZy1jcmVkZW50aWFsIjoibWVyY2hhbnQtYXNzZXRzQHNob3BpZnktdGllcnMuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb21cLzIwMjYwNjE0XC9hdXRvXC9zdG9yYWdlXC9nb29nNF9yZXF1ZXN0In0seyJ4LWdvb2ctYWxnb3JpdGhtIjoiR09PRzQtUlNBLVNIQTI1NiJ9XSwiZXhwaXJhdGlvbiI6IjIwMjYtMDYtMTVUMjA6MjM6MDdaIn0=" \
  -F "file=@index.liquid"
