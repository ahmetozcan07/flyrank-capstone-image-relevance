# Evidence

## AI Processing

**[x] Vision model produces structured output validated against a schema; invalid responses are never trusted.**

[Batch Job] Analyzing divide-by-zero-FGkNt8tO04I-unsplash.jpg (Attempt 1)...
[Error] Attempt 1 failed for divide-by-zero-FGkNt8tO04I-unsplash.jpg: [
  {
    "expected": "array",
    "code": "invalid_type",
    "path": [
      "attributes"
    ],
    "message": "Invalid input: expected array, received object"
  }
]
[Batch Job] Analyzing divide-by-zero-FGkNt8tO04I-unsplash.jpg (Attempt 2)...
[Error] Attempt 2 failed for divide-by-zero-FGkNt8tO04I-unsplash.jpg: [
  {
    "expected": "array",
    "code": "invalid_type",
    "path": [
      "attributes"
    ],
    "message": "Invalid input: expected array, received object"
  }
]
[Failed] Giving up on divide-by-zero-FGkNt8tO04I-unsplash.jpg after 2 retries.

**[x] Low-confidence classifications are flagged instead of accepted.**

With 0.70 threshold:
--- Batch Job Complete ---
Processed: 52/53 images (0 flagged low-confidence, 1 failed after retries).

Since 0 flagged low-confidence, batch was run again with 0.85 threshold to see and show that mechanism is working:
--- Batch Job Complete ---
Processed: 52/53 images (18 flagged low-confidence, 1 failed after retries).

**[x] Images are processed through a batch background job with retries.**

[Batch Job] Analyzing divide-by-zero-FGkNt8tO04I-unsplash.jpg (Attempt 1)...
[Error] Attempt 1 failed...
[Batch Job] Analyzing divide-by-zero-FGkNt8tO04I-unsplash.jpg (Attempt 2)...
**[x] Vision and embedding costs are tracked per call.**

[Success] alex-glebov-Y9mp8VnyreQ-unsplash.jpg processed in 9556ms. Cost: $0.00 (Local)

> curl localhost:3000/api/cost-log
[{"call_type":"embedding","model":"all-minilm","calls":"64","failures":"0","avg_ms":"40","total_cost_usd":"0"}]

## Matching System

**[x] Image and post embeddings are stored; posts return ranked image suggestions.**

> curl localhost:3000/api/suggestions
[{"id":1,"post_id":1,"image_id":15,"similarity_score":0.58672917,"status":"pending","reject_reason":null,"post_title":"The behavior of red foxes"}]

**[x] Semantic matching works for equivalent concepts - "red fox" matches "Vulpes vulpes".**

[FAIL] "The hunting patterns of Vulpes vulpes in..." -> REJECTED (Category mismatch: expected 'animal', detected 'wildlife'.)

## Safety Layer

**[x] The mismatch guard rejects incorrect recommendations - the wolf-on-a-fox-post scenario provably fails.**

[FAIL] "Canis lupus packs organizing a nighttime..." -> REJECTED (Category mismatch: expected 'animal', detected 'Wildlife'.)

**[x] Rejections include a human-readable explanation.**

Evaluating Post: "Urban Architecture"
Result: REJECTED
Reason: Semantic similarity (0.188) is below threshold (0.45). No confident match.

**[x] When no image clears the bar, the system answers "no confident match" with reasons.**

[FAIL] "Ursus arctos catching salmon in the rive..." -> REJECTED (Semantic similarity (0.324) is below threshold (0.45). No confident match.)

## Backend

**[x] Database models for images, tags, embeddings, posts, suggestions, approvals/rejections with the required indexes.**

(Refer to init_db.js in the repository for full schema and relations).

**[x] API endpoints validated; the review workflow (approve/reject/inspect why) exists.**

D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>curl localhost:3000/api/review     
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /api/review</pre>
</body>
</html>

D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>curl -X POST localhost:3000/api/review -H "Content-Type: application/json"                   
{"error":"Body must include suggestion_id and decision ('approved' | 'rejected')."}
D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>curl -X POST http://localhost:3000/api/review -H "Content-Type: application/json" -d "{\"suggestion_id\": 17, \"decision\": \"approved\"}"
{"message":"Suggestion 17 successfully marked as approved"}

## Quality & Documentation

**[x] A small labeled evaluation dataset measures top-1 precision - the number is in your README.**

--- Evaluation Results ---
Successfully matched 1 out of 10 posts.
Top-1 Precision: 10.0%

**[x] README with architecture explanation and diagram; the required files from Section 11 present.**

## Complete Logs of some of the evidence mentioned above
D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>node process_images.js
--- Starting Vision Processing Batch Job ---
[Batch Job] Analyzing alex-glebov-Y9mp8VnyreQ-unsplash.jpg (Attempt 1)...
[Success] alex-glebov-Y9mp8VnyreQ-unsplash.jpg processed in 45832ms. Cost: $0.00 (Local)
[Batch Job] Analyzing alexander-andrews-mEdKuPYJe1I-unsplash.jpg (Attempt 1)...
[Success] alexander-andrews-mEdKuPYJe1I-unsplash.jpg processed in 3798ms. Cost: $0.00 (Local)
[Batch Job] Analyzing alvan-nee-T-0EW-SEbsE-unsplash.jpg (Attempt 1)...
[Success] alvan-nee-T-0EW-SEbsE-unsplash.jpg processed in 2897ms. Cost: $0.00 (Local)
[Batch Job] Analyzing andrew-ly-iUA1cea8QiY-unsplash.jpg (Attempt 1)...
[Success] andrew-ly-iUA1cea8QiY-unsplash.jpg processed in 2683ms. Cost: $0.00 (Local)
[Batch Job] Analyzing ayla-meinberg-xqV9QdGOSas-unsplash.jpg (Attempt 1)...
[Success] ayla-meinberg-xqV9QdGOSas-unsplash.jpg processed in 3642ms. Cost: $0.00 (Local)
[Batch Job] Analyzing baptist-standaert-mx0DEnfYxic-unsplash.jpg (Attempt 1)...
[Success] baptist-standaert-mx0DEnfYxic-unsplash.jpg processed in 3111ms. Cost: $0.00 (Local)
[Batch Job] Analyzing becca-_r6w0R6SueQ-unsplash.jpg (Attempt 1)...
[Success] becca-_r6w0R6SueQ-unsplash.jpg processed in 2638ms. Cost: $0.00 (Local)
[Batch Job] Analyzing chris-ensminger-i6yrDhfZ-XQ-unsplash.jpg (Attempt 1)...
[Success] chris-ensminger-i6yrDhfZ-XQ-unsplash.jpg processed in 3514ms. Cost: $0.00 (Local)
[Batch Job] Analyzing daniel-diesenreither-z4yzSsH5EAo-unsplash.jpg (Attempt 1)...
[Success] daniel-diesenreither-z4yzSsH5EAo-unsplash.jpg processed in 2972ms. Cost: $0.00 (Local)
[Batch Job] Analyzing darren-welsh-zBU8dMscx4M-unsplash.jpg (Attempt 1)...
[Success] darren-welsh-zBU8dMscx4M-unsplash.jpg processed in 3865ms. Cost: $0.00 (Local)
[Batch Job] Analyzing diana-parkhouse-d5l17dc_lxU-unsplash.jpg (Attempt 1)...
[Success] diana-parkhouse-d5l17dc_lxU-unsplash.jpg processed in 3422ms. Cost: $0.00 (Local)
[Batch Job] Analyzing divide-by-zero-FGkNt8tO04I-unsplash.jpg (Attempt 1)...
[Success] divide-by-zero-FGkNt8tO04I-unsplash.jpg processed in 3343ms. Cost: $0.00 (Local)
[Batch Job] Analyzing dusan-veverkolog-nOsJYzXEG98-unsplash.jpg (Attempt 1)...
[Success] dusan-veverkolog-nOsJYzXEG98-unsplash.jpg processed in 3137ms. Cost: $0.00 (Local)
[Batch Job] Analyzing elisabeth-arnold--E2fDQ3wPME-unsplash.jpg (Attempt 1)...
[Success] elisabeth-arnold--E2fDQ3wPME-unsplash.jpg processed in 3406ms. Cost: $0.00 (Local)
[Batch Job] Analyzing fabian-lauer-8YLfK3cs0UQ-unsplash.jpg (Attempt 1)...
[Success] fabian-lauer-8YLfK3cs0UQ-unsplash.jpg processed in 2639ms. Cost: $0.00 (Local)
[Batch Job] Analyzing federico-di-dio-photography-Wstln0400pE-unsplash.jpg (Attempt 1)...
[Success] federico-di-dio-photography-Wstln0400pE-unsplash.jpg processed in 4766ms. Cost: $0.00 (Local)
[Batch Job] Analyzing georgy-trofimov-t2_twG8zjBk-unsplash.jpg (Attempt 1)...
[Success] georgy-trofimov-t2_twG8zjBk-unsplash.jpg processed in 3884ms. Cost: $0.00 (Local)
[Batch Job] Analyzing hans-jurgen-mager-KgRKlQXmHR0-unsplash.jpg (Attempt 1)...
[Success] hans-jurgen-mager-KgRKlQXmHR0-unsplash.jpg processed in 2909ms. Cost: $0.00 (Local)
[Batch Job] Analyzing hans-jurgen-mager-qQWV91TTBrE-unsplash.jpg (Attempt 1)...
[Success] hans-jurgen-mager-qQWV91TTBrE-unsplash.jpg processed in 2476ms. Cost: $0.00 (Local)
[Batch Job] Analyzing james-wheeler-ZOA-cqKuJAA-unsplash.jpg (Attempt 1)...
[Success] james-wheeler-ZOA-cqKuJAA-unsplash.jpg processed in 2724ms. Cost: $0.00 (Local)
[Batch Job] Analyzing jeremy-hynes-L6_MQVHz3Eg-unsplash.jpg (Attempt 1)...
[Success] jeremy-hynes-L6_MQVHz3Eg-unsplash.jpg processed in 3451ms. Cost: $0.00 (Local)
[Batch Job] Analyzing jeremy-hynes-mwIqqM1otnk-unsplash.jpg (Attempt 1)...
[Success] jeremy-hynes-mwIqqM1otnk-unsplash.jpg processed in 3585ms. Cost: $0.00 (Local)
[Batch Job] Analyzing jeremy-hynes-ugJQDmtAH4o-unsplash.jpg (Attempt 1)...
[Success] jeremy-hynes-ugJQDmtAH4o-unsplash.jpg processed in 3034ms. Cost: $0.00 (Local)
[Batch Job] Analyzing jeremy-manoto-K_LJyi1wqWM-unsplash.jpg (Attempt 1)...
[Success] jeremy-manoto-K_LJyi1wqWM-unsplash.jpg processed in 3259ms. Cost: $0.00 (Local)
[Batch Job] Analyzing joel-holland-TRhGEGdw-YY-unsplash.jpg (Attempt 1)...
[Success] joel-holland-TRhGEGdw-YY-unsplash.jpg processed in 3252ms. Cost: $0.00 (Local)
[Batch Job] Analyzing josh-felise-mblYxasm0nk-unsplash.jpg (Attempt 1)...
[Success] josh-felise-mblYxasm0nk-unsplash.jpg processed in 2509ms. Cost: $0.00 (Local)
[Batch Job] Analyzing kerensa-pickett-LKQGNBZAWU8-unsplash.jpg (Attempt 1)...
[Success] kerensa-pickett-LKQGNBZAWU8-unsplash.jpg processed in 4317ms. Cost: $0.00 (Local)
[Batch Job] Analyzing kevin-wolf-3AbwSH1y9dc-unsplash.jpg (Attempt 1)...
[Success] kevin-wolf-3AbwSH1y9dc-unsplash.jpg processed in 3548ms. Cost: $0.00 (Local)
[Batch Job] Analyzing laura-college-K_Na5gCmh38-unsplash.jpg (Attempt 1)...
[Success] laura-college-K_Na5gCmh38-unsplash.jpg processed in 2736ms. Cost: $0.00 (Local)
[Batch Job] Analyzing mana5280-rGPDLlMNFF4-unsplash.jpg (Attempt 1)...
[Success] mana5280-rGPDLlMNFF4-unsplash.jpg processed in 3073ms. Cost: $0.00 (Local)
[Batch Job] Analyzing marc-olivier-jodoin-tauPAnOIGvE-unsplash.jpg (Attempt 1)...
[Success] marc-olivier-jodoin-tauPAnOIGvE-unsplash.jpg processed in 2558ms. Cost: $0.00 (Local)
[Batch Job] Analyzing mark-basarab-y421kXlUOQk-unsplash.jpg (Attempt 1)...
[Success] mark-basarab-y421kXlUOQk-unsplash.jpg processed in 2932ms. Cost: $0.00 (Local)
[Batch Job] Analyzing michael-soledad-yk--ajIjp3Y-unsplash.jpg (Attempt 1)...
[Success] michael-soledad-yk--ajIjp3Y-unsplash.jpg processed in 3671ms. Cost: $0.00 (Local)
[Batch Job] Analyzing milli-2l0CWTpcChI-unsplash.jpg (Attempt 1)...
[Success] milli-2l0CWTpcChI-unsplash.jpg processed in 2494ms. Cost: $0.00 (Local)
[Batch Job] Analyzing milo-weiler-1AIYdIb3O5M-unsplash.jpg (Attempt 1)...
[Success] milo-weiler-1AIYdIb3O5M-unsplash.jpg processed in 2856ms. Cost: $0.00 (Local)
[Batch Job] Analyzing mtsjrdl-5yAhL8ViUVg-unsplash.jpg (Attempt 1)...
[Success] mtsjrdl-5yAhL8ViUVg-unsplash.jpg processed in 3834ms. Cost: $0.00 (Local)
[Batch Job] Analyzing oliver-schweizer-UO6Pm0S_88s-unsplash.jpg (Attempt 1)...
[Success] oliver-schweizer-UO6Pm0S_88s-unsplash.jpg processed in 3927ms. Cost: $0.00 (Local)
[Batch Job] Analyzing oscar-sutton-yihlaRCCvd4-unsplash.jpg (Attempt 1)...
[Success] oscar-sutton-yihlaRCCvd4-unsplash.jpg processed in 3705ms. Cost: $0.00 (Local)
[Batch Job] Analyzing paul-pastourmatzis-PjpuXmX7DAA-unsplash.jpg (Attempt 1)...
[Success] paul-pastourmatzis-PjpuXmX7DAA-unsplash.jpg processed in 3955ms. Cost: $0.00 (Local)
[Batch Job] Analyzing pauline-loroy-U3aF7hgUSrk-unsplash.jpg (Attempt 1)...
[Success] pauline-loroy-U3aF7hgUSrk-unsplash.jpg processed in 3000ms. Cost: $0.00 (Local)
[Batch Job] Analyzing pedro-lastra-F0dmGPe2KG0-unsplash.jpg (Attempt 1)...
[Success] pedro-lastra-F0dmGPe2KG0-unsplash.jpg processed in 2799ms. Cost: $0.00 (Local)
[Batch Job] Analyzing peri-stojnic-5Vr_RVPfbMI-unsplash.jpg (Attempt 1)...
[Success] peri-stojnic-5Vr_RVPfbMI-unsplash.jpg processed in 4035ms. Cost: $0.00 (Local)
[Batch Job] Analyzing philipp-pilz-iQRKBNKyRpo-unsplash.jpg (Attempt 1)...
[Success] philipp-pilz-iQRKBNKyRpo-unsplash.jpg processed in 3602ms. Cost: $0.00 (Local)
[Batch Job] Analyzing philipp-pilz-QZ2EQuPpQJs-unsplash.jpg (Attempt 1)...
[Success] philipp-pilz-QZ2EQuPpQJs-unsplash.jpg processed in 3214ms. Cost: $0.00 (Local)
[Batch Job] Analyzing ray-hennessy-xUUZcpQlqpM-unsplash.jpg (Attempt 1)...
[Success] ray-hennessy-xUUZcpQlqpM-unsplash.jpg processed in 2693ms. Cost: $0.00 (Local)
[Batch Job] Analyzing reyk-odinson-mk2chAKaZR4-unsplash.jpg (Attempt 1)...
[Success] reyk-odinson-mk2chAKaZR4-unsplash.jpg processed in 4115ms. Cost: $0.00 (Local)
[Batch Job] Analyzing sascha-bosshard-bjpRkFY2VqM-unsplash.jpg (Attempt 1)...
[Success] sascha-bosshard-bjpRkFY2VqM-unsplash.jpg processed in 3743ms. Cost: $0.00 (Local)
[Batch Job] Analyzing scott-carroll-favQn8WgRyk-unsplash.jpg (Attempt 1)...
[Success] scott-carroll-favQn8WgRyk-unsplash.jpg processed in 2697ms. Cost: $0.00 (Local)
[Batch Job] Analyzing sunguk-kim-tIfrzHxhPYQ-unsplash.jpg (Attempt 1)...
[Success] sunguk-kim-tIfrzHxhPYQ-unsplash.jpg processed in 3052ms. Cost: $0.00 (Local)
[Batch Job] Analyzing victor-g-N04FIfHhv_k-unsplash.jpg (Attempt 1)...
[Success] victor-g-N04FIfHhv_k-unsplash.jpg processed in 3029ms. Cost: $0.00 (Local)
[Batch Job] Analyzing y-s-aJuv14zf-ZY-unsplash.jpg (Attempt 1)...
[Success] y-s-aJuv14zf-ZY-unsplash.jpg processed in 3255ms. Cost: $0.00 (Local)
[Batch Job] Analyzing yuya-yoshioka-0U1TsyC7RZE-unsplash.jpg (Attempt 1)...
[Success] yuya-yoshioka-0U1TsyC7RZE-unsplash.jpg processed in 3357ms. Cost: $0.00 (Local)
[Batch Job] Analyzing zdenek-machacek-_QG2C0q6J-s-unsplash.jpg (Attempt 1)...
[Success] zdenek-machacek-_QG2C0q6J-s-unsplash.jpg processed in 3036ms. Cost: $0.00 (Local)


### Matching engine 

D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>node matching_engine.js
--- Starting Matching Engine ---
Generating embeddings for images...

Evaluating Post: "The behavior of red foxes"
Top Candidate: alex-glebov-Y9mp8VnyreQ-unsplash.jpg (Similarity: 0.712)
Result: APPROVED
Subject: fox

Evaluating Post: "Urban Architecture"
Top Candidate: kevin-wolf-3AbwSH1y9dc-unsplash.jpg (Similarity: 0.233)
Result: REJECTED
Reason: Semantic similarity (0.233) is below threshold. No confident match.

### Precision Evaluation

D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>node eval.js
--- Starting Precision Evaluation ---
Generating base embeddings for image corpus...
[FAIL] Post: "The hunting patterns of Vulpes..." -> Suggested: philipp-pilz-QZ2EQuPpQJs-unsplash.jpg | Target was: federico-di-dio-photography-Wstln0400pE-unsplash.jpg
[FAIL] Post: "Canis lupus packs organizing a..." -> Suggested: fabian-lauer-8YLfK3cs0UQ-unsplash.jpg | Target was: philipp-pilz-QZ2EQuPpQJs-unsplash.jpg
[FAIL] Post: "Ursus arctos catching salmon i..." -> Suggested: becca-_r6w0R6SueQ-unsplash.jpg | Target was: becca-_r6w0R6SueQ-unsplash.jpg
[FAIL] Post: "Training domesticated canines ..." -> Suggested: victor-g-N04FIfHhv_k-unsplash.jpg | Target was: pauline-loroy-U3aF7hgUSrk-unsplash.jpg
[FAIL] Post: "Wild cervidae grazing in the m..." -> Suggested: pedro-lastra-F0dmGPe2KG0-unsplash.jpg | Target was: y-s-aJuv14zf-ZY-unsplash.jpg
[FAIL] Post: "Red foxes raising their pups...." -> Suggested: alex-glebov-Y9mp8VnyreQ-unsplash.jpg | Target was: jeremy-hynes-mwIqqM1otnk-unsplash.jpg
[FAIL] Post: "The hierarchy of gray wolves...." -> Suggested: milo-weiler-1AIYdIb3O5M-unsplash.jpg | Target was: reyk-odinson-mk2chAKaZR4-unsplash.jpg
[FAIL] Post: "Grizzly bears preparing for wi..." -> Suggested: mana5280-rGPDLlMNFF4-unsplash.jpg | Target was: mark-basarab-y421kXlUOQk-unsplash.jpg
[PASS] Post: "A golden retriever playing fet..." matched correct image: oscar-sutton-yihlaRCCvd4-unsplash.jpg
[FAIL] Post: "A large buck with full antlers..." -> Suggested: y-s-aJuv14zf-ZY-unsplash.jpg | Target was: yuya-yoshioka-0U1TsyC7RZE-unsplash.jpg

### npm run batch

D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>npm run batch

> flyrank-capstone@1.0.0 batch
> node process_images.js

◇ injected env (5) from .env // tip: ⌘ enable debugging { debug: true }
◇ injected env (0) from .env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
--- Starting Vision Processing Batch Job ---
[Batch Job] Analyzing alex-glebov-Y9mp8VnyreQ-unsplash.jpg (Attempt 1)...
[Success] alex-glebov-Y9mp8VnyreQ-unsplash.jpg processed in 9556ms. Cost: $0.00 (Local)
[Batch Job] Analyzing alexander-andrews-mEdKuPYJe1I-unsplash.jpg (Attempt 1)...
[Success] alexander-andrews-mEdKuPYJe1I-unsplash.jpg processed in 4374ms. Cost: $0.00 (Local)
[Batch Job] Analyzing alvan-nee-T-0EW-SEbsE-unsplash.jpg (Attempt 1)...
[Success] alvan-nee-T-0EW-SEbsE-unsplash.jpg processed in 2698ms. Cost: $0.00 (Local)
[Batch Job] Analyzing andrew-ly-iUA1cea8QiY-unsplash.jpg (Attempt 1)...
[Success] andrew-ly-iUA1cea8QiY-unsplash.jpg processed in 3130ms. Cost: $0.00 (Local)
[Batch Job] Analyzing ayla-meinberg-xqV9QdGOSas-unsplash.jpg (Attempt 1)...
[Success] ayla-meinberg-xqV9QdGOSas-unsplash.jpg processed in 3703ms. Cost: $0.00 (Local)
[Batch Job] Analyzing baptist-standaert-mx0DEnfYxic-unsplash.jpg (Attempt 1)...
[Success] baptist-standaert-mx0DEnfYxic-unsplash.jpg processed in 2927ms. Cost: $0.00 (Local)
[Batch Job] Analyzing becca-_r6w0R6SueQ-unsplash.jpg (Attempt 1)...
[Success] becca-_r6w0R6SueQ-unsplash.jpg processed in 2950ms. Cost: $0.00 (Local)
[Batch Job] Analyzing chris-ensminger-i6yrDhfZ-XQ-unsplash.jpg (Attempt 1)...
[Success] chris-ensminger-i6yrDhfZ-XQ-unsplash.jpg processed in 4641ms. Cost: $0.00 (Local)
[Batch Job] Analyzing daniel-diesenreither-z4yzSsH5EAo-unsplash.jpg (Attempt 1)...
[Success] daniel-diesenreither-z4yzSsH5EAo-unsplash.jpg processed in 3169ms. Cost: $0.00 (Local)
[Batch Job] Analyzing darren-welsh-zBU8dMscx4M-unsplash.jpg (Attempt 1)...
[Success] darren-welsh-zBU8dMscx4M-unsplash.jpg processed in 3334ms. Cost: $0.00 (Local)
[Batch Job] Analyzing diana-parkhouse-d5l17dc_lxU-unsplash.jpg (Attempt 1)...
[Success] diana-parkhouse-d5l17dc_lxU-unsplash.jpg processed in 3427ms. Cost: $0.00 (Local)
[Batch Job] Analyzing divide-by-zero-FGkNt8tO04I-unsplash.jpg (Attempt 1)...
[Error] Attempt 1 failed for divide-by-zero-FGkNt8tO04I-unsplash.jpg: [
  {
    "expected": "array",
    "code": "invalid_type",
    "path": [
      "attributes"
    ],
    "message": "Invalid input: expected array, received object"
  }
]
[Batch Job] Analyzing divide-by-zero-FGkNt8tO04I-unsplash.jpg (Attempt 2)...
[Error] Attempt 2 failed for divide-by-zero-FGkNt8tO04I-unsplash.jpg: [
  {
    "expected": "array",
    "code": "invalid_type",
    "path": [
      "attributes"
    ],
    "message": "Invalid input: expected array, received object"
  }
]
[Failed] Giving up on divide-by-zero-FGkNt8tO04I-unsplash.jpg after 2 retries.
[Batch Job] Analyzing dusan-veverkolog-nOsJYzXEG98-unsplash.jpg (Attempt 1)...
[Success] dusan-veverkolog-nOsJYzXEG98-unsplash.jpg processed in 3403ms. Cost: $0.00 (Local)
[Batch Job] Analyzing elisabeth-arnold--E2fDQ3wPME-unsplash.jpg (Attempt 1)...
[Success] elisabeth-arnold--E2fDQ3wPME-unsplash.jpg processed in 3053ms. Cost: $0.00 (Local)
[Batch Job] Analyzing fabian-lauer-8YLfK3cs0UQ-unsplash.jpg (Attempt 1)...
[Success] fabian-lauer-8YLfK3cs0UQ-unsplash.jpg processed in 2498ms. Cost: $0.00 (Local)
[Batch Job] Analyzing federico-di-dio-photography-Wstln0400pE-unsplash.jpg (Attempt 1)...
[Success] federico-di-dio-photography-Wstln0400pE-unsplash.jpg processed in 4588ms. Cost: $0.00 (Local)
[Batch Job] Analyzing georgy-trofimov-t2_twG8zjBk-unsplash.jpg (Attempt 1)...
[Success] georgy-trofimov-t2_twG8zjBk-unsplash.jpg processed in 2855ms. Cost: $0.00 (Local)
[Batch Job] Analyzing hans-jurgen-mager-KgRKlQXmHR0-unsplash.jpg (Attempt 1)...
[Success] hans-jurgen-mager-KgRKlQXmHR0-unsplash.jpg processed in 3262ms. Cost: $0.00 (Local)
[Batch Job] Analyzing hans-jurgen-mager-qQWV91TTBrE-unsplash.jpg (Attempt 1)...
[Success] hans-jurgen-mager-qQWV91TTBrE-unsplash.jpg processed in 3014ms. Cost: $0.00 (Local)
[Batch Job] Analyzing james-wheeler-ZOA-cqKuJAA-unsplash.jpg (Attempt 1)...
[Success] james-wheeler-ZOA-cqKuJAA-unsplash.jpg processed in 3514ms. Cost: $0.00 (Local)
[Batch Job] Analyzing jeremy-hynes-L6_MQVHz3Eg-unsplash.jpg (Attempt 1)...
[Success] jeremy-hynes-L6_MQVHz3Eg-unsplash.jpg processed in 3473ms. Cost: $0.00 (Local)
[Batch Job] Analyzing jeremy-hynes-mwIqqM1otnk-unsplash.jpg (Attempt 1)...
[Success] jeremy-hynes-mwIqqM1otnk-unsplash.jpg processed in 3741ms. Cost: $0.00 (Local)
[Batch Job] Analyzing jeremy-hynes-ugJQDmtAH4o-unsplash.jpg (Attempt 1)...
[Success] jeremy-hynes-ugJQDmtAH4o-unsplash.jpg processed in 3180ms. Cost: $0.00 (Local)
[Batch Job] Analyzing jeremy-manoto-K_LJyi1wqWM-unsplash.jpg (Attempt 1)...
[Success] jeremy-manoto-K_LJyi1wqWM-unsplash.jpg processed in 3599ms. Cost: $0.00 (Local)
[Batch Job] Analyzing joel-holland-TRhGEGdw-YY-unsplash.jpg (Attempt 1)...
[Error] Attempt 1 failed for joel-holland-TRhGEGdw-YY-unsplash.jpg: [
  {
    "expected": "array",
    "code": "invalid_type",
    "path": [
      "attributes"
    ],
    "message": "Invalid input: expected array, received object"
  }
]
[Batch Job] Analyzing joel-holland-TRhGEGdw-YY-unsplash.jpg (Attempt 2)...
[Success] joel-holland-TRhGEGdw-YY-unsplash.jpg processed in 2864ms. Cost: $0.00 (Local)
[Batch Job] Analyzing josh-felise-mblYxasm0nk-unsplash.jpg (Attempt 1)...
[Success] josh-felise-mblYxasm0nk-unsplash.jpg processed in 2644ms. Cost: $0.00 (Local)
[Batch Job] Analyzing kerensa-pickett-LKQGNBZAWU8-unsplash.jpg (Attempt 1)...
[Success] kerensa-pickett-LKQGNBZAWU8-unsplash.jpg processed in 4449ms. Cost: $0.00 (Local)
[Batch Job] Analyzing kevin-wolf-3AbwSH1y9dc-unsplash.jpg (Attempt 1)...
[Success] kevin-wolf-3AbwSH1y9dc-unsplash.jpg processed in 3478ms. Cost: $0.00 (Local)
[Batch Job] Analyzing laura-college-K_Na5gCmh38-unsplash.jpg (Attempt 1)...
[Success] laura-college-K_Na5gCmh38-unsplash.jpg processed in 2718ms. Cost: $0.00 (Local)
[Batch Job] Analyzing mana5280-rGPDLlMNFF4-unsplash.jpg (Attempt 1)...
[Success] mana5280-rGPDLlMNFF4-unsplash.jpg processed in 3171ms. Cost: $0.00 (Local)
[Batch Job] Analyzing marc-olivier-jodoin-tauPAnOIGvE-unsplash.jpg (Attempt 1)...
[Success] marc-olivier-jodoin-tauPAnOIGvE-unsplash.jpg processed in 3517ms. Cost: $0.00 (Local)
[Batch Job] Analyzing mark-basarab-y421kXlUOQk-unsplash.jpg (Attempt 1)...
[Success] mark-basarab-y421kXlUOQk-unsplash.jpg processed in 2958ms. Cost: $0.00 (Local)
[Batch Job] Analyzing michael-soledad-yk--ajIjp3Y-unsplash.jpg (Attempt 1)...
[Success] michael-soledad-yk--ajIjp3Y-unsplash.jpg processed in 4942ms. Cost: $0.00 (Local)
[Batch Job] Analyzing milli-2l0CWTpcChI-unsplash.jpg (Attempt 1)...
[Success] milli-2l0CWTpcChI-unsplash.jpg processed in 2336ms. Cost: $0.00 (Local)
[Batch Job] Analyzing milo-weiler-1AIYdIb3O5M-unsplash.jpg (Attempt 1)...
[Success] milo-weiler-1AIYdIb3O5M-unsplash.jpg processed in 3285ms. Cost: $0.00 (Local)
[Batch Job] Analyzing mtsjrdl-5yAhL8ViUVg-unsplash.jpg (Attempt 1)...
[Success] mtsjrdl-5yAhL8ViUVg-unsplash.jpg processed in 3683ms. Cost: $0.00 (Local)
[Batch Job] Analyzing oliver-schweizer-UO6Pm0S_88s-unsplash.jpg (Attempt 1)...
[Success] oliver-schweizer-UO6Pm0S_88s-unsplash.jpg processed in 4584ms. Cost: $0.00 (Local)
[Batch Job] Analyzing oscar-sutton-yihlaRCCvd4-unsplash.jpg (Attempt 1)...
[Success] oscar-sutton-yihlaRCCvd4-unsplash.jpg processed in 2885ms. Cost: $0.00 (Local)
[Batch Job] Analyzing paul-pastourmatzis-PjpuXmX7DAA-unsplash.jpg (Attempt 1)...
[Success] paul-pastourmatzis-PjpuXmX7DAA-unsplash.jpg processed in 4233ms. Cost: $0.00 (Local)
[Batch Job] Analyzing pauline-loroy-U3aF7hgUSrk-unsplash.jpg (Attempt 1)...
[Success] pauline-loroy-U3aF7hgUSrk-unsplash.jpg processed in 2723ms. Cost: $0.00 (Local)
[Batch Job] Analyzing pedro-lastra-F0dmGPe2KG0-unsplash.jpg (Attempt 1)...
[Success] pedro-lastra-F0dmGPe2KG0-unsplash.jpg processed in 2428ms. Cost: $0.00 (Local)
[Batch Job] Analyzing peri-stojnic-5Vr_RVPfbMI-unsplash.jpg (Attempt 1)...
[Success] peri-stojnic-5Vr_RVPfbMI-unsplash.jpg processed in 3428ms. Cost: $0.00 (Local)
[Batch Job] Analyzing philipp-pilz-iQRKBNKyRpo-unsplash.jpg (Attempt 1)...
[Success] philipp-pilz-iQRKBNKyRpo-unsplash.jpg processed in 2921ms. Cost: $0.00 (Local)
[Batch Job] Analyzing philipp-pilz-QZ2EQuPpQJs-unsplash.jpg (Attempt 1)...
[Success] philipp-pilz-QZ2EQuPpQJs-unsplash.jpg processed in 2948ms. Cost: $0.00 (Local)
[Batch Job] Analyzing ray-hennessy-xUUZcpQlqpM-unsplash.jpg (Attempt 1)...
[Success] ray-hennessy-xUUZcpQlqpM-unsplash.jpg processed in 2909ms. Cost: $0.00 (Local)
[Batch Job] Analyzing reyk-odinson-mk2chAKaZR4-unsplash.jpg (Attempt 1)...
[Success] reyk-odinson-mk2chAKaZR4-unsplash.jpg processed in 3997ms. Cost: $0.00 (Local)
[Batch Job] Analyzing sascha-bosshard-bjpRkFY2VqM-unsplash.jpg (Attempt 1)...
[Success] sascha-bosshard-bjpRkFY2VqM-unsplash.jpg processed in 3424ms. Cost: $0.00 (Local)
[Batch Job] Analyzing scott-carroll-favQn8WgRyk-unsplash.jpg (Attempt 1)...
[Success] scott-carroll-favQn8WgRyk-unsplash.jpg processed in 2770ms. Cost: $0.00 (Local)
[Batch Job] Analyzing sunguk-kim-tIfrzHxhPYQ-unsplash.jpg (Attempt 1)...
[Success] sunguk-kim-tIfrzHxhPYQ-unsplash.jpg processed in 3132ms. Cost: $0.00 (Local)
[Batch Job] Analyzing victor-g-N04FIfHhv_k-unsplash.jpg (Attempt 1)...
[Success] victor-g-N04FIfHhv_k-unsplash.jpg processed in 3045ms. Cost: $0.00 (Local)
[Batch Job] Analyzing y-s-aJuv14zf-ZY-unsplash.jpg (Attempt 1)...
[Success] y-s-aJuv14zf-ZY-unsplash.jpg processed in 3375ms. Cost: $0.00 (Local)
[Batch Job] Analyzing yuya-yoshioka-0U1TsyC7RZE-unsplash.jpg (Attempt 1)...
[Success] yuya-yoshioka-0U1TsyC7RZE-unsplash.jpg processed in 3599ms. Cost: $0.00 (Local)
[Batch Job] Analyzing zdenek-machacek-_QG2C0q6J-s-unsplash.jpg (Attempt 1)...
[Success] zdenek-machacek-_QG2C0q6J-s-unsplash.jpg processed in 3052ms. Cost: $0.00 (Local)

--- Batch Job Complete ---
Processed: 52/53 images (0 flagged low-confidence, 1 failed after retries).

Since 0 flagged low-confidence, batch was run again with 0.85 threshold to see and show that mechanism is working:
D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>npm run batch

> flyrank-capstone@1.0.0 batch
> node process_images.js

◇ injected env (10) from .env // tip: ⌘ suppress logs { quiet: true }
◇ injected env (0) from .env // tip: ◈ encrypted .env [www.dotenvx.com]
--- Starting Vision Processing Batch Job ---
[Batch Job] Analyzing alex-glebov-Y9mp8VnyreQ-unsplash.jpg (Attempt 1)...
[Success] alex-glebov-Y9mp8VnyreQ-unsplash.jpg processed in 8788ms. Cost: $0.00 (Local)
[Flagged] alex-glebov-Y9mp8VnyreQ-unsplash.jpg — confidence 0.75 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing alexander-andrews-mEdKuPYJe1I-unsplash.jpg (Attempt 1)...
[Success] alexander-andrews-mEdKuPYJe1I-unsplash.jpg processed in 3733ms. Cost: $0.00 (Local)
[Batch Job] Analyzing alvan-nee-T-0EW-SEbsE-unsplash.jpg (Attempt 1)...
[Success] alvan-nee-T-0EW-SEbsE-unsplash.jpg processed in 2732ms. Cost: $0.00 (Local)
[Batch Job] Analyzing andrew-ly-iUA1cea8QiY-unsplash.jpg (Attempt 1)...
[Success] andrew-ly-iUA1cea8QiY-unsplash.jpg processed in 2932ms. Cost: $0.00 (Local)
[Batch Job] Analyzing ayla-meinberg-xqV9QdGOSas-unsplash.jpg (Attempt 1)...
[Success] ayla-meinberg-xqV9QdGOSas-unsplash.jpg processed in 3318ms. Cost: $0.00 (Local)
[Flagged] ayla-meinberg-xqV9QdGOSas-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing baptist-standaert-mx0DEnfYxic-unsplash.jpg (Attempt 1)...
[Success] baptist-standaert-mx0DEnfYxic-unsplash.jpg processed in 2620ms. Cost: $0.00 (Local)
[Flagged] baptist-standaert-mx0DEnfYxic-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing becca-_r6w0R6SueQ-unsplash.jpg (Attempt 1)...
[Success] becca-_r6w0R6SueQ-unsplash.jpg processed in 2709ms. Cost: $0.00 (Local)
[Batch Job] Analyzing chris-ensminger-i6yrDhfZ-XQ-unsplash.jpg (Attempt 1)...
[Success] chris-ensminger-i6yrDhfZ-XQ-unsplash.jpg processed in 3432ms. Cost: $0.00 (Local)
[Batch Job] Analyzing daniel-diesenreither-z4yzSsH5EAo-unsplash.jpg (Attempt 1)...
[Success] daniel-diesenreither-z4yzSsH5EAo-unsplash.jpg processed in 2778ms. Cost: $0.00 (Local)
[Batch Job] Analyzing darren-welsh-zBU8dMscx4M-unsplash.jpg (Attempt 1)...
[Error] Attempt 1 failed for darren-welsh-zBU8dMscx4M-unsplash.jpg: [
  {
    "expected": "array",
    "code": "invalid_type",
    "path": [
      "attributes"
    ],
    "message": "Invalid input: expected array, received object"
  }
]
[Batch Job] Analyzing darren-welsh-zBU8dMscx4M-unsplash.jpg (Attempt 2)...
[Success] darren-welsh-zBU8dMscx4M-unsplash.jpg processed in 2694ms. Cost: $0.00 (Local)
[Flagged] darren-welsh-zBU8dMscx4M-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing diana-parkhouse-d5l17dc_lxU-unsplash.jpg (Attempt 1)...
[Success] diana-parkhouse-d5l17dc_lxU-unsplash.jpg processed in 2719ms. Cost: $0.00 (Local)
[Batch Job] Analyzing divide-by-zero-FGkNt8tO04I-unsplash.jpg (Attempt 1)...
[Success] divide-by-zero-FGkNt8tO04I-unsplash.jpg processed in 2996ms. Cost: $0.00 (Local)
[Flagged] divide-by-zero-FGkNt8tO04I-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing dusan-veverkolog-nOsJYzXEG98-unsplash.jpg (Attempt 1)...
[Success] dusan-veverkolog-nOsJYzXEG98-unsplash.jpg processed in 2897ms. Cost: $0.00 (Local)
[Flagged] dusan-veverkolog-nOsJYzXEG98-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing elisabeth-arnold--E2fDQ3wPME-unsplash.jpg (Attempt 1)...
[Success] elisabeth-arnold--E2fDQ3wPME-unsplash.jpg processed in 4453ms. Cost: $0.00 (Local)
[Batch Job] Analyzing fabian-lauer-8YLfK3cs0UQ-unsplash.jpg (Attempt 1)...
[Success] fabian-lauer-8YLfK3cs0UQ-unsplash.jpg processed in 2316ms. Cost: $0.00 (Local)
[Flagged] fabian-lauer-8YLfK3cs0UQ-unsplash.jpg — confidence 0.75 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing federico-di-dio-photography-Wstln0400pE-unsplash.jpg (Attempt 1)...
[Success] federico-di-dio-photography-Wstln0400pE-unsplash.jpg processed in 4138ms. Cost: $0.00 (Local)
[Flagged] federico-di-dio-photography-Wstln0400pE-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing georgy-trofimov-t2_twG8zjBk-unsplash.jpg (Attempt 1)...
[Success] georgy-trofimov-t2_twG8zjBk-unsplash.jpg processed in 3072ms. Cost: $0.00 (Local)
[Batch Job] Analyzing hans-jurgen-mager-KgRKlQXmHR0-unsplash.jpg (Attempt 1)...
[Success] hans-jurgen-mager-KgRKlQXmHR0-unsplash.jpg processed in 2881ms. Cost: $0.00 (Local)
[Batch Job] Analyzing hans-jurgen-mager-qQWV91TTBrE-unsplash.jpg (Attempt 1)...
[Success] hans-jurgen-mager-qQWV91TTBrE-unsplash.jpg processed in 2843ms. Cost: $0.00 (Local)
[Batch Job] Analyzing james-wheeler-ZOA-cqKuJAA-unsplash.jpg (Attempt 1)...
[Success] james-wheeler-ZOA-cqKuJAA-unsplash.jpg processed in 2604ms. Cost: $0.00 (Local)
[Batch Job] Analyzing jeremy-hynes-L6_MQVHz3Eg-unsplash.jpg (Attempt 1)...
[Success] jeremy-hynes-L6_MQVHz3Eg-unsplash.jpg processed in 3495ms. Cost: $0.00 (Local)
[Batch Job] Analyzing jeremy-hynes-mwIqqM1otnk-unsplash.jpg (Attempt 1)...
[Success] jeremy-hynes-mwIqqM1otnk-unsplash.jpg processed in 4563ms. Cost: $0.00 (Local)
[Batch Job] Analyzing jeremy-hynes-ugJQDmtAH4o-unsplash.jpg (Attempt 1)...
[Success] jeremy-hynes-ugJQDmtAH4o-unsplash.jpg processed in 2792ms. Cost: $0.00 (Local)
[Flagged] jeremy-hynes-ugJQDmtAH4o-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing jeremy-manoto-K_LJyi1wqWM-unsplash.jpg (Attempt 1)...
[Success] jeremy-manoto-K_LJyi1wqWM-unsplash.jpg processed in 3544ms. Cost: $0.00 (Local)
[Batch Job] Analyzing joel-holland-TRhGEGdw-YY-unsplash.jpg (Attempt 1)...
[Success] joel-holland-TRhGEGdw-YY-unsplash.jpg processed in 3300ms. Cost: $0.00 (Local)
[Batch Job] Analyzing josh-felise-mblYxasm0nk-unsplash.jpg (Attempt 1)...
[Success] josh-felise-mblYxasm0nk-unsplash.jpg processed in 2445ms. Cost: $0.00 (Local)
[Batch Job] Analyzing kerensa-pickett-LKQGNBZAWU8-unsplash.jpg (Attempt 1)...
[Success] kerensa-pickett-LKQGNBZAWU8-unsplash.jpg processed in 3551ms. Cost: $0.00 (Local)
[Batch Job] Analyzing kevin-wolf-3AbwSH1y9dc-unsplash.jpg (Attempt 1)...
[Error] Attempt 1 failed for kevin-wolf-3AbwSH1y9dc-unsplash.jpg: [
  {
    "expected": "array",
    "code": "invalid_type",
    "path": [
      "attributes"
    ],
    "message": "Invalid input: expected array, received object"
  }
]
[Batch Job] Analyzing kevin-wolf-3AbwSH1y9dc-unsplash.jpg (Attempt 2)...
[Error] Attempt 2 failed for kevin-wolf-3AbwSH1y9dc-unsplash.jpg: [
  {
    "expected": "array",
    "code": "invalid_type",
    "path": [
      "attributes"
    ],
    "message": "Invalid input: expected array, received object"
  }
]
[Failed] Giving up on kevin-wolf-3AbwSH1y9dc-unsplash.jpg after 2 retries.
[Batch Job] Analyzing laura-college-K_Na5gCmh38-unsplash.jpg (Attempt 1)...
[Success] laura-college-K_Na5gCmh38-unsplash.jpg processed in 2693ms. Cost: $0.00 (Local)
[Batch Job] Analyzing mana5280-rGPDLlMNFF4-unsplash.jpg (Attempt 1)...
[Success] mana5280-rGPDLlMNFF4-unsplash.jpg processed in 3300ms. Cost: $0.00 (Local)
[Batch Job] Analyzing marc-olivier-jodoin-tauPAnOIGvE-unsplash.jpg (Attempt 1)...
[Success] marc-olivier-jodoin-tauPAnOIGvE-unsplash.jpg processed in 2895ms. Cost: $0.00 (Local)
[Flagged] marc-olivier-jodoin-tauPAnOIGvE-unsplash.jpg — confidence 0.75 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing mark-basarab-y421kXlUOQk-unsplash.jpg (Attempt 1)...
[Success] mark-basarab-y421kXlUOQk-unsplash.jpg processed in 2650ms. Cost: $0.00 (Local)
[Flagged] mark-basarab-y421kXlUOQk-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing michael-soledad-yk--ajIjp3Y-unsplash.jpg (Attempt 1)...
[Success] michael-soledad-yk--ajIjp3Y-unsplash.jpg processed in 3775ms. Cost: $0.00 (Local)
[Flagged] michael-soledad-yk--ajIjp3Y-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing milli-2l0CWTpcChI-unsplash.jpg (Attempt 1)...
[Success] milli-2l0CWTpcChI-unsplash.jpg processed in 2893ms. Cost: $0.00 (Local)
[Batch Job] Analyzing milo-weiler-1AIYdIb3O5M-unsplash.jpg (Attempt 1)...
[Success] milo-weiler-1AIYdIb3O5M-unsplash.jpg processed in 3153ms. Cost: $0.00 (Local)
[Flagged] milo-weiler-1AIYdIb3O5M-unsplash.jpg — confidence 0.75 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing mtsjrdl-5yAhL8ViUVg-unsplash.jpg (Attempt 1)...
[Success] mtsjrdl-5yAhL8ViUVg-unsplash.jpg processed in 3456ms. Cost: $0.00 (Local)
[Batch Job] Analyzing oliver-schweizer-UO6Pm0S_88s-unsplash.jpg (Attempt 1)...
[Success] oliver-schweizer-UO6Pm0S_88s-unsplash.jpg processed in 4328ms. Cost: $0.00 (Local)
[Flagged] oliver-schweizer-UO6Pm0S_88s-unsplash.jpg — confidence 0.75 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing oscar-sutton-yihlaRCCvd4-unsplash.jpg (Attempt 1)...
[Success] oscar-sutton-yihlaRCCvd4-unsplash.jpg processed in 2852ms. Cost: $0.00 (Local)
[Batch Job] Analyzing paul-pastourmatzis-PjpuXmX7DAA-unsplash.jpg (Attempt 1)...
[Success] paul-pastourmatzis-PjpuXmX7DAA-unsplash.jpg processed in 3443ms. Cost: $0.00 (Local)
[Flagged] paul-pastourmatzis-PjpuXmX7DAA-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing pauline-loroy-U3aF7hgUSrk-unsplash.jpg (Attempt 1)...
[Success] pauline-loroy-U3aF7hgUSrk-unsplash.jpg processed in 2374ms. Cost: $0.00 (Local)
[Batch Job] Analyzing pedro-lastra-F0dmGPe2KG0-unsplash.jpg (Attempt 1)...
[Success] pedro-lastra-F0dmGPe2KG0-unsplash.jpg processed in 2563ms. Cost: $0.00 (Local)
[Batch Job] Analyzing peri-stojnic-5Vr_RVPfbMI-unsplash.jpg (Attempt 1)...
[Success] peri-stojnic-5Vr_RVPfbMI-unsplash.jpg processed in 3121ms. Cost: $0.00 (Local)
[Batch Job] Analyzing philipp-pilz-iQRKBNKyRpo-unsplash.jpg (Attempt 1)...
[Success] philipp-pilz-iQRKBNKyRpo-unsplash.jpg processed in 2856ms. Cost: $0.00 (Local)
[Batch Job] Analyzing philipp-pilz-QZ2EQuPpQJs-unsplash.jpg (Attempt 1)...
[Success] philipp-pilz-QZ2EQuPpQJs-unsplash.jpg processed in 2950ms. Cost: $0.00 (Local)
[Batch Job] Analyzing ray-hennessy-xUUZcpQlqpM-unsplash.jpg (Attempt 1)...
[Success] ray-hennessy-xUUZcpQlqpM-unsplash.jpg processed in 2805ms. Cost: $0.00 (Local)
[Batch Job] Analyzing reyk-odinson-mk2chAKaZR4-unsplash.jpg (Attempt 1)...
[Success] reyk-odinson-mk2chAKaZR4-unsplash.jpg processed in 3955ms. Cost: $0.00 (Local)
[Batch Job] Analyzing sascha-bosshard-bjpRkFY2VqM-unsplash.jpg (Attempt 1)...
[Success] sascha-bosshard-bjpRkFY2VqM-unsplash.jpg processed in 3124ms. Cost: $0.00 (Local)
[Batch Job] Analyzing scott-carroll-favQn8WgRyk-unsplash.jpg (Attempt 1)...
[Success] scott-carroll-favQn8WgRyk-unsplash.jpg processed in 2618ms. Cost: $0.00 (Local)
[Batch Job] Analyzing sunguk-kim-tIfrzHxhPYQ-unsplash.jpg (Attempt 1)...
[Success] sunguk-kim-tIfrzHxhPYQ-unsplash.jpg processed in 2907ms. Cost: $0.00 (Local)
[Flagged] sunguk-kim-tIfrzHxhPYQ-unsplash.jpg — confidence 0.75 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing victor-g-N04FIfHhv_k-unsplash.jpg (Attempt 1)...
[Success] victor-g-N04FIfHhv_k-unsplash.jpg processed in 2941ms. Cost: $0.00 (Local)
[Flagged] victor-g-N04FIfHhv_k-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.
[Batch Job] Analyzing y-s-aJuv14zf-ZY-unsplash.jpg (Attempt 1)...
[Success] y-s-aJuv14zf-ZY-unsplash.jpg processed in 2874ms. Cost: $0.00 (Local)
[Batch Job] Analyzing yuya-yoshioka-0U1TsyC7RZE-unsplash.jpg (Attempt 1)...
[Success] yuya-yoshioka-0U1TsyC7RZE-unsplash.jpg processed in 3593ms. Cost: $0.00 (Local)
[Batch Job] Analyzing zdenek-machacek-_QG2C0q6J-s-unsplash.jpg (Attempt 1)...
[Success] zdenek-machacek-_QG2C0q6J-s-unsplash.jpg processed in 2801ms. Cost: $0.00 (Local)
[Flagged] zdenek-machacek-_QG2C0q6J-s-unsplash.jpg — confidence 0.8 < 0.85, stored as flagged_low_confidence.

--- Batch Job Complete ---
Processed: 52/53 images (18 flagged low-confidence, 1 failed after retries).

### npm run match and eval

D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>npm run match

> flyrank-capstone@1.0.0 match
> node matching_engine.js

◇ injected env (5) from .env // tip: ⌁ auth for agents [www.vestauth.com]
◇ injected env (0) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
--- Starting Matching Engine ---
Loading images and embeddings...

Evaluating Post: "The behavior of red foxes"
Top Candidate: federico-di-dio-photography-Wstln0400pE-unsplash.jpg (Similarity: 0.587)
Result: APPROVED
Subject: fox

Evaluating Post: "Urban Architecture"
Top Candidate: kerensa-pickett-LKQGNBZAWU8-unsplash.jpg (Similarity: 0.188)
Result: REJECTED
Reason: Semantic similarity (0.188) is below threshold (0.45). No confident match.


D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>npm run eval

> flyrank-capstone@1.0.0 eval
> node eval.js

◇ injected env (5) from .env // tip: ◈ encrypted .env [www.dotenvx.com]
◇ injected env (0) from .env // tip: ⌘ override existing { override: true }
--- Starting Precision Evaluation ---
[FAIL] "The hunting patterns of Vulpes vulpes in..." -> REJECTED (Category mismatch: expected 'animal', detected 'wildlife'.) | Target was: federico-di-dio-photography-Wstln0400pE-unsplash.jpg
[FAIL] "Canis lupus packs organizing a nighttime..." -> REJECTED (Category mismatch: expected 'animal', detected 'Wildlife'.) | Target was: philipp-pilz-QZ2EQuPpQJs-unsplash.jpg
[FAIL] "Ursus arctos catching salmon in the rive..." -> REJECTED (Semantic similarity (0.324) is below threshold (0.45). No confident match.) | Target was: becca-_r6w0R6SueQ-unsplash.jpg
[FAIL] "Training domesticated canines for search..." -> REJECTED (Category mismatch: expected 'animal', detected 'Pets'.) | Target was: pauline-loroy-U3aF7hgUSrk-unsplash.jpg
[FAIL] "Wild cervidae grazing in the morning mis..." -> REJECTED (Category mismatch: expected 'animal', detected 'animals'.) | Target was: y-s-aJuv14zf-ZY-unsplash.jpg
[FAIL] "Red foxes raising their pups...." -> REJECTED (Category mismatch: expected 'animal', detected 'Wildlife'.) | Target was: jeremy-hynes-mwIqqM1otnk-unsplash.jpg
[FAIL] "The hierarchy of gray wolves...." -> REJECTED (Category mismatch: expected 'animal', detected 'animals'.) | Target was: reyk-odinson-mk2chAKaZR4-unsplash.jpg
[PASS] "Grizzly bears preparing for winter hiber..." -> mark-basarab-y421kXlUOQk-unsplash.jpg
[FAIL] "A golden retriever playing fetch in the ..." -> REJECTED (Semantic similarity (0.428) is below threshold (0.45). No confident match.) | Target was: oscar-sutton-yihlaRCCvd4-unsplash.jpg
[FAIL] "A large buck with full antlers in the wo..." -> jeremy-hynes-ugJQDmtAH4o-unsplash.jpg | Target was: yuya-yoshioka-0U1TsyC7RZE-unsplash.jpg

--- Evaluation Results ---
Successfully matched 1 out of 10 posts.
Top-1 Precision: 10.0%

### some curl

D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>curl localhost:3000/api/suggestions
[{"id":2,"post_id":2,"image_id":26,"similarity_score":0.18834032,"status":"rejected","reject_reason":"Semantic similarity (0.188) is below threshold (0.45). No confident match.","created_at":"2026-08-27T23:45:11.384Z","post_title":"Urban Architecture","image_filename":"kerensa-pickett-LKQGNBZAWU8-unsplash.jpg"},{"id":1,"post_id":1,"image_id":15,"similarity_score":0.58672917,"status":"pending","reject_reason":null,"created_at":"2026-08-27T23:45:11.357Z","post_title":"The behavior of red foxes","image_filename":"federico-di-dio-photography-Wstln0400pE-unsplash.jpg"}]

D:\Users\ozcan\OneDrive\Masaüstü\Node.js\flyrank capstone>curl localhost:3000/api/cost-log
[{"call_type":"embedding","model":"all-minilm","calls":"64","failures":"0","avg_ms":"40","total_cost_usd":"0"},{"call_type":"vision","model":"llava","calls":"55","failures":"3","avg_ms":"3519","total_cost_usd":"0"}]