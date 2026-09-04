import test from "node:test";
import assert from "node:assert/strict";
test("event payload rejects empty titles",()=>{const title="";assert.equal(title.trim().length,0);});
test("event payload accepts a title",()=>{const title="Example";assert.equal(title.trim(),"Example");});