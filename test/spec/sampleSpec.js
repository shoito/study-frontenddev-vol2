(function() {

  describe("mochaサンプル", function() {
    it("テストが実行される", function() {
      return sayHello().should.equal("hello");
    });
    return it("連続的にテストが実行される", function() {
      return sayHello().should.equal("hello");
    });
  });

}).call(this);
