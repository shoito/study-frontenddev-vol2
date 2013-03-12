describe "mochaサンプル", ->
    it "テストが実行される", ->
        sayHello().should.equal "hello"

    it "連続的にテストが実行される", ->
        sayHello().should.equal "hello"