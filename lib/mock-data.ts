import type { CaseRecord } from "./types";

/**
 * Real on-chain cases finalized by GenLayer StudioNet validator consensus
 * Target Contract: 0x4FA892C70149522d21Ac76509559Bb1105f14205
 */
export const SAMPLE_CASES: CaseRecord[] = [
  {
    "case_id": "case-1789056699432-7",
    "created_at": "2026-09-10T16:11:43.075227Z",
    "delivery_hash": "0x948eb01f55fe9471c1f620e53a9f5adae612ee9eb668c596fda05a03ea16e0ee",
    "judgment": {
      "admissibility": [
        {
          "id": "art-api-endpoint",
          "reason": "Artifact is reachable, content retrieved, integrity status UNCOMMITTED but content is independently inspectable. No prompt injection or tampering detected.",
          "status": "ADMISSIBLE"
        }
      ],
      "appealGrounds": [],
      "caseId": "case-1789056699432-7",
      "confidenceBps": 10000,
      "contradictions": [],
      "criteria": [
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-https-200",
          "reason": "Independent fetch to https://httpbin.org/get returned HTTP status 200 OK.",
          "reasonCode": "HTTP_STATUS_200",
          "result": "PASS",
          "severity": "CRITICAL",
          "weightBps": 5000
        },
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-json-format",
          "reason": "Response body content is valid, parseable JSON.",
          "reasonCode": "JSON_PARSE_SUCCESS",
          "result": "PASS",
          "severity": "MEDIUM",
          "weightBps": 5000
        }
      ],
      "evidenceCommitment": "0x77c0bd109871fee5512a85bbd22e6e710729564cddc6ed33967292026c2fd058",
      "materialBreaches": [],
      "missingEvidence": [],
      "schemaVersion": "1.0",
      "settlementBps": 10000,
      "summary": "All mandatory and non-critical criteria are satisfied. The primary endpoint responds with HTTPS 200 OK, and the response body is valid JSON.",
      "verdict": "FULFILLED"
    },
    "judgment_hash": "0x25a7c3747ed791f8227da2a16beca2184c5d6a79ed5d1336abe6981665721708",
    "mandate_hash": "0xc31af178da179d975d162b6e36a91e2a511879534e15894c4b258a68dee7f74b",
    "policy": "SOFTWARE_WEB_V1",
    "report_hash": "0x30e54fc4717c95dbf5bf77a33fd97d6b6f2b3d6dc3e2760b3ab31297d5c8b96a",
    "status": "FINALIZED",
    "updated_at": "2026-09-10T16:11:43.075227Z"
  },
  {
    "case_id": "case-1789056624905-6",
    "created_at": "2026-09-10T16:10:28.535925Z",
    "delivery_hash": "0xdaef47b80ac66e7ae54fb362bef79386bd5d89f2358ae105e9249b125febd330",
    "judgment": {
      "admissibility": [
        {
          "id": "art-api-endpoint",
          "reason": "Independently fetched artifact was accessible at the submitted URL, returned HTTP 200, and its body was directly inspectable. Integrity is UNCOMMITTED because no committed hash was provided, but that does not prevent evaluating the observed response for the stated criteria.",
          "status": "ADMISSIBLE"
        }
      ],
      "appealGrounds": [],
      "caseId": "case-1789056624905-6",
      "confidenceBps": 9300,
      "contradictions": [],
      "criteria": [
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-https-200",
          "reason": "Independent fetch of the primary public endpoint at https://httpbin.org/get succeeded over HTTPS and returned HTTP status 200 OK.",
          "reasonCode": "HTTPS_200_OBSERVED",
          "result": "PASS",
          "severity": "CRITICAL",
          "weightBps": 5000
        },
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-json-format",
          "reason": "Independent fetch returned a response body that is parseable as JSON, containing top-level keys including args, headers, origin, and url.",
          "reasonCode": "JSON_PARSEABLE_OBSERVED",
          "result": "PASS",
          "severity": "LOW",
          "weightBps": 5000
        }
      ],
      "evidenceCommitment": "0x197f98f0ce155d46af3aa872f8993446edf75ddc587d189f6d277a1339a3344c",
      "materialBreaches": [],
      "missingEvidence": [],
      "schemaVersion": "1.0",
      "settlementBps": 10000,
      "summary": "Both acceptance criteria were satisfied by independent inspection: the HTTPS endpoint returned 200 OK and the response body was valid JSON.",
      "verdict": "FULFILLED"
    },
    "judgment_hash": "0xaeaa4b5b79d58797ea85f67bd1a587d9663e90e4b5a168b71c23055edbf7e8ef",
    "mandate_hash": "0xc563035380efe5593cf10a3a79c55c5fae9dc512f83176cefae13049257c998e",
    "policy": "SOFTWARE_WEB_V1",
    "report_hash": "0x1d9564614bad892e3e8fd5e358b30ae40b039ba12c57e04143b2c21ca77fcb3e",
    "status": "FINALIZED",
    "updated_at": "2026-09-10T16:10:28.535925Z"
  },
  {
    "case_id": "case-1789056566610-5",
    "created_at": "2026-09-10T16:09:30.232610Z",
    "delivery_hash": "0xc2f0518885179f79e088f6d9bc0f4ad1a0551bfcadc93d4d5a03ca327226b79b",
    "judgment": {
      "admissibility": [
        {
          "id": "art-api-endpoint",
          "reason": "Independently fetched live artifact from the submitted public HTTPS endpoint was accessible and inspectable; integrity is uncommitted because no submitted hash was provided, but that does not prevent evaluating live status and response content for this mandate.",
          "status": "ADMISSIBLE"
        }
      ],
      "appealGrounds": [],
      "caseId": "case-1789056566610-5",
      "confidenceBps": 9600,
      "contradictions": [],
      "criteria": [
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-https-200",
          "reason": "Independent fetch of https://httpbin.org/get succeeded over HTTPS and returned HTTP 200 OK.",
          "reasonCode": "HTTPS_200_OBSERVED",
          "result": "PASS",
          "severity": "CRITICAL",
          "weightBps": 5000
        },
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-json-format",
          "reason": "Independent fetch returned a response body that is parseable as JSON content.",
          "reasonCode": "JSON_PARSEABLE_OBSERVED",
          "result": "PASS",
          "severity": "LOW",
          "weightBps": 5000
        }
      ],
      "evidenceCommitment": "0x4530062f8720c210b4ce5af57e343cebc66889f561524ce7b3778680a6175f86",
      "materialBreaches": [],
      "missingEvidence": [],
      "schemaVersion": "1.0",
      "settlementBps": 10000,
      "summary": "Independent inspection confirms the public HTTPS endpoint returned 200 OK and the response body was valid JSON. All acceptance criteria pass.",
      "verdict": "FULFILLED"
    },
    "judgment_hash": "0xa829934f21abf29d8231770cf73c2bffb9a544af7e67b69b7430a441947e1d93",
    "mandate_hash": "0x8d5027253e8585d359980d560d80f557ab8b2de2c064353c48a0e49dd830a8be",
    "policy": "SOFTWARE_WEB_V1",
    "report_hash": "0x55cec45ae62747ecdc33d1f7d849227985c819f1eb777871791ac7aa496aeec7",
    "status": "FINALIZED",
    "updated_at": "2026-09-10T16:09:30.232610Z"
  },
  {
    "case_id": "case-1789056484579-4",
    "created_at": "2026-09-10T16:08:08.250685Z",
    "delivery_hash": "0x19554f78bd42f7634b001873094ad79d7829354de4f25999b4ea220867d41cf9",
    "judgment": {
      "admissibility": [
        {
          "id": "art-api-endpoint",
          "reason": "URL was independently fetched by the court. HTTP 200 status confirmed. Response body retrieved. No committed SHA-256 was provided (submitted_sha256 is empty), so content integrity cannot be bound to a pre-committed identity; however, the observed content is available for direct inspection. Marked ADMISSIBLE for factual observations (status code, body content) but integrity binding is UNCOMMITTED.",
          "status": "ADMISSIBLE"
        }
      ],
      "appealGrounds": [
        "Provider submitted no SHA-256 hash for the artifact, preventing content-identity binding. Future submissions should include a pre-committed hash to enable integrity verification."
      ],
      "caseId": "case-1789056484579-4",
      "confidenceBps": 9200,
      "contradictions": [],
      "criteria": [
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-https-200",
          "reason": "Court independently fetched https://httpbin.org/get. The URL scheme is HTTPS (TLS). The server returned HTTP status 200 OK. Both sub-conditions of this criterion (HTTPS transport and 200 OK status) are directly observed in the independently fetched evidence. No reliance on provider claims.",
          "reasonCode": "INDEPENDENT_FETCH_STATUS_200_HTTPS_CONFIRMED",
          "result": "PASS",
          "severity": "CRITICAL",
          "weightBps": 5000
        },
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-json-format",
          "reason": "The independently fetched response body is a well-formed JSON object containing keys 'args', 'headers', 'origin', and 'url', all with valid JSON types. The body is parseable as JSON. Criterion satisfied.",
          "reasonCode": "RESPONSE_BODY_VALID_JSON_CONFIRMED",
          "result": "PASS",
          "severity": "MEDIUM",
          "weightBps": 5000
        }
      ],
      "evidenceCommitment": "0x20ad7cdf75a370a29c4a5b9d79d6be52db6b208c43203742773a20d5359ae1c3",
      "materialBreaches": [],
      "missingEvidence": [],
      "schemaVersion": "1.0",
      "settlementBps": 10000,
      "summary": "The court independently fetched https://httpbin.org/get and observed an HTTP 200 OK response over HTTPS with a valid, parseable JSON body. Both acceptance criteria — the critical HTTPS/200 requirement (5000 bps) and the non-critical JSON format requirement (5000 bps) — are independently confirmed as PASS. No material breaches detected. The sole noted deficiency is the absence of a pre-committed SHA-256 hash in the delivery manifest, which prevents content-identity binding but does not affect the factual observations made by direct court inspection. Verdict: FULFILLED. Full settlement of 10000 bps awarded.",
      "verdict": "FULFILLED"
    },
    "judgment_hash": "0x8c88d5c4248661b986ff025ea97df160e535d76dd34dd9d79d4a6eeb293a76c6",
    "mandate_hash": "0x45cab342e1e3174e441e4212bf9865c3152ab04eff53d02b8304e18a24146606",
    "policy": "SOFTWARE_WEB_V1",
    "report_hash": "0x2ce09682269b5571b4801f45b939c901291670fe608eba9a55c356878617ec26",
    "status": "FINALIZED",
    "updated_at": "2026-09-10T16:08:08.250685Z"
  },
  {
    "case_id": "case-1789056223936-2",
    "created_at": "2026-09-10T16:03:47.643092Z",
    "delivery_hash": "0xf9b589f43d321c6f0940939b9b75489b9869dddee6f332a2a5c6a0950841bed0",
    "judgment": {
      "admissibility": [
        {
          "id": "art-api-endpoint",
          "reason": "Independently fetched artifact from provided URL returned valid status and content matching the manifest intent.",
          "status": "ADMISSIBLE"
        }
      ],
      "appealGrounds": [],
      "caseId": "case-1789056223936-2",
      "confidenceBps": 10000,
      "contradictions": [],
      "criteria": [
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-https-200",
          "reason": "The endpoint https://httpbin.org/get responded with a 200 OK status over HTTPS as verified by independent fetch.",
          "reasonCode": "HTTP_200_OK",
          "result": "PASS",
          "severity": "CRITICAL",
          "weightBps": 5000
        },
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-json-format",
          "reason": "The response body was successfully parsed as a valid JSON object.",
          "reasonCode": "JSON_PARSE_SUCCESS",
          "result": "PASS",
          "severity": "LOW",
          "weightBps": 5000
        }
      ],
      "evidenceCommitment": "0x9eea9fa75e705e62e055b37e1164dd07ab6b14b5fe382b55d2a8fa2eff5544c4",
      "materialBreaches": [],
      "missingEvidence": [],
      "schemaVersion": "1.0",
      "settlementBps": 10000,
      "summary": "The provider successfully delivered a public API endpoint that meets all mandatory and non-mandatory criteria, including HTTPS connectivity, 200 OK status, and valid JSON formatting.",
      "verdict": "FULFILLED"
    },
    "judgment_hash": "0xb0033e56e886878cc52861abc5ed6a6b57c77094ae1d38d30f3f69b3d0e93f63",
    "mandate_hash": "0x3f594704477e8de99da75be6b75e2d2bd4b083c275b6f18233cfb9584f441053",
    "policy": "SOFTWARE_WEB_V1",
    "report_hash": "0x890fa2c9d1e886cd5cd077f47cb38cf4adc82fadf004218dec435ad126de6f97",
    "status": "FINALIZED",
    "updated_at": "2026-09-10T16:03:47.643092Z"
  },
  {
    "case_id": "case-1789056011800-1",
    "created_at": "2026-09-10T16:00:15.898528Z",
    "delivery_hash": "0x1b9f77747e23438d2beeddac05b3d62d3ecc07ff3bb5b85764b96139faa59a9d",
    "judgment": {
      "admissibility": [
        {
          "id": "art-api-endpoint",
          "reason": "Independently fetched live artifact was accessible at the submitted HTTPS URL, returned HTTP 200, and content was directly inspectable. Integrity is UNCOMMITTED because no submitted hash was provided, but that does not bar admissibility for evaluating live behavior.",
          "status": "ADMISSIBLE"
        }
      ],
      "appealGrounds": [],
      "caseId": "case-1789056011800-1",
      "confidenceBps": 9600,
      "contradictions": [],
      "criteria": [
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-https-200",
          "reason": "Independent fetch of https://httpbin.org/get succeeded over HTTPS and returned HTTP status 200 OK.",
          "reasonCode": "HTTPS_200_OBSERVED",
          "result": "PASS",
          "severity": "CRITICAL",
          "weightBps": 5000
        },
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-json-format",
          "reason": "Independent fetch response body was inspectable and parseable as valid JSON content.",
          "reasonCode": "JSON_PARSEABLE_OBSERVED",
          "result": "PASS",
          "severity": "LOW",
          "weightBps": 5000
        }
      ],
      "evidenceCommitment": "0x52647ab1a80b0b228bf10af194454da3c116e69d64b58aa32d370d09f27c77a8",
      "materialBreaches": [],
      "missingEvidence": [],
      "schemaVersion": "1.0",
      "settlementBps": 10000,
      "summary": "Independent inspection confirms the public HTTPS endpoint returned 200 OK and the response body was valid JSON; all acceptance criteria pass.",
      "verdict": "FULFILLED"
    },
    "judgment_hash": "0x8a8672fac3b200eb0843b975432ecf93b69d6793b74f6a04db12924a4a0edc39",
    "mandate_hash": "0x4fe45ca5dcdfdb8e09b25fa6dcd052796081ab864dde9e4ea6f85b1ae764230b",
    "policy": "SOFTWARE_WEB_V1",
    "report_hash": "0x89ccfd4bf0ef28aa537186275666d5f589742e2e6488fe0d843b9c96563be74c",
    "status": "FINALIZED",
    "updated_at": "2026-09-10T16:00:15.898528Z"
  },
  {
    "case_id": "case-1789009125755",
    "created_at": "2026-09-10T02:58:49.072452Z",
    "delivery_hash": "0xfcbfba2b1553eafafe7bbbe4ca1627f75cdf378845e41f0436f08079511e1d68",
    "judgment": {
      "admissibility": [
        {
          "id": "art-package-json",
          "reason": "Independently fetched artifact was accessible at the declared URL with HTTP 200 and its JSON content was directly inspectable. Submitted SHA-256 was blank, so identity was not pre-committed and integrity is only established for the retrieved content, not against a prior commitment. Still relevant and admissible for evaluating the manifest contents.",
          "status": "ADMISSIBLE"
        }
      ],
      "appealGrounds": [],
      "caseId": "case-1789009125755",
      "confidenceBps": 9600,
      "contradictions": [],
      "criteria": [
        {
          "evidenceRefs": [
            "art-package-json"
          ],
          "id": "crit-pkg-name",
          "reason": "The retrieved package manifest is valid JSON and contains \"name\": \"lexarbiter\".",
          "reasonCode": "JSON_VALID_NAME_MATCH",
          "result": "PASS",
          "severity": "CRITICAL",
          "weightBps": 5000
        },
        {
          "evidenceRefs": [
            "art-package-json"
          ],
          "id": "crit-dependencies-present",
          "reason": "The retrieved package manifest declares both core dependencies under dependencies: \"next\": \"^15.2.1\" and \"genlayer-js\": \"1.1.8\".",
          "reasonCode": "DEPENDENCIES_DECLARED",
          "result": "PASS",
          "severity": "LOW",
          "weightBps": 5000
        }
      ],
      "evidenceCommitment": "0x0fab5facf05152259f9c4e348637972dbdbd277ef8839df4d6c7b17788129dfa",
      "materialBreaches": [],
      "missingEvidence": [],
      "schemaVersion": "1.0",
      "settlementBps": 10000,
      "summary": "Independent inspection of the submitted package.json found a valid JSON manifest named lexarbiter with both required core dependencies, next and genlayer-js, declared.",
      "verdict": "FULFILLED"
    },
    "judgment_hash": "0x531863c3265504269edf5ed0ce14950117283658456b42dee2adef1dce73f7cd",
    "mandate_hash": "0xdca156c0503434ff5e12b46d6199b43d72b240fe875fb9dbda6361fe95ae740e",
    "policy": "SOFTWARE_WEB_V1",
    "report_hash": "0xabf122e154b146e0c721ce8b3eee680eda0b7405f762775cfe9c89f9485edcf0",
    "status": "FINALIZED",
    "updated_at": "2026-09-10T02:58:49.072452Z"
  },
  {
    "case_id": "case-1789006588547",
    "created_at": "2026-09-10T02:16:31.777005Z",
    "delivery_hash": "0xcc1be25860521613fec3702e4a7151a746e0157148fb796dc2113786ab622f66",
    "judgment": {
      "admissibility": [
        {
          "id": "art-api-endpoint",
          "reason": "Artifact independently fetched via HTTPS; observed status and content allow for objective verification despite missing submission hash.",
          "status": "ADMISSIBLE"
        }
      ],
      "appealGrounds": [],
      "caseId": "case-1789006588547",
      "confidenceBps": 10000,
      "contradictions": [],
      "criteria": [
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-https-reachable",
          "reason": "Independently verified HTTPS request returned a 200 OK status code.",
          "reasonCode": "HTTP_200_OK",
          "result": "PASS",
          "severity": "CRITICAL",
          "weightBps": 5000
        },
        {
          "evidenceRefs": [
            "art-api-endpoint"
          ],
          "id": "crit-json-payload",
          "reason": "Payload parsed successfully as valid structured JSON.",
          "reasonCode": "JSON_VALID",
          "result": "PASS",
          "severity": "LOW",
          "weightBps": 5000
        }
      ],
      "evidenceCommitment": "0x7a07b5ca6f938006049cea0221d31aa7e32f17fedf08331cdcee3d9cb0923356",
      "materialBreaches": [],
      "missingEvidence": [],
      "schemaVersion": "1.0",
      "settlementBps": 10000,
      "summary": "The provider successfully delivered a reachable HTTPS endpoint that returns the required valid JSON payload. All criteria, including the critical reachability requirement, were satisfied.",
      "verdict": "FULFILLED"
    },
    "judgment_hash": "0xfcf2351c514544785e4178b71c492bbb7477a005dc0b432f2ca0a6bc97c74b10",
    "mandate_hash": "0x94b5955ead9750acbb10ccf30a270eb3d8dee48f007bbbcafff1840458ae29f8",
    "policy": "SOFTWARE_WEB_V1",
    "report_hash": "0x43954d956612160a3e3564b742c1b7261bc9b07841e57119e109b0f2ebe8dcc1",
    "status": "FINALIZED",
    "updated_at": "2026-09-10T02:16:31.777005Z"
  }
];
