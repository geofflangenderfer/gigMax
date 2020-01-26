import { hello } from '../firstTest';
import { expect } from 'chai';
import 'mocha';

describe('Hello function', () => {
  it('should return "Hello, World!"', () => {
    let result = hello();
    expect(result).to.equal("Hello, World!");
  });
});
