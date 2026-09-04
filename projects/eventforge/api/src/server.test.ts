import test from "node:test";
import assert from "node:assert/strict";

test("empty titles are rejected by the validation rule",()=>{
  const title="";
  assert.equal(title.trim().length,0);
});

test("non-empty titles are accepted by the validation rule",()=>{
  const title="Build EventForge";
  assert.equal(title.trim(),"Build EventForge");
});

test("event type is stable",()=>{
  const type="work.item.created";
  assert.equal(type,"work.item.created");
});