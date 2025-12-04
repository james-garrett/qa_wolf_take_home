import { ERROR_MESSAGES } from '../errors.js';
import { valideDateOrder } from '../index.js';
import { expect } from 'chai';

// Simple test to make sure installation worked
describe("Array", function () {
  describe("#indexOf()", function () {
    it("should return -1 when the value is not present", function () {
      expect([1, 2, 3].indexOf(4)).to.equal(-1);
    });
  });
});

describe("ValidateDateOrder", function () {
  it("should return false when null", function () {
    expect(() => valideDateOrder(null)).to.throw(ERROR_MESSAGES.DATELIST_INVALID_DATA);
  });
});