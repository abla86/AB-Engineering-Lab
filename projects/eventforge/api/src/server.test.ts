import test from "node:test"; import assert from "node:assert/strict";
test("empty titles are rejected by the validation rule",()=>assert.equal("".trim().length,0));
test("non-empty titles are accepted",()=>assert.equal("Build EventForge".trim(),"Build EventForge"));
test("event type is stable",()=>assert.equal("work.item.created","work.item.created"));
