const sum = (a:number,b:number)=>{
    return a+b
}

describe("should sum up test two pairs",()=>{


    it("5 + 5 = 10",()=>{
        expect(sum(5,5)).toBe(10)
    })

})