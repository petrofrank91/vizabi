describe("Bubble Chart Model", function() {
    it("should have default trails as 'none'", function() {

        var model = new gapminder.bubbleChartModel();
        var defaultTrails = model.get("trails");

        expect(defaultTrails).toBe("none");
    });

    it("should be able to receive the value you can set via 'set' method", function() {
        var model = new gapminder.bubbleChartModel();

        spyOn(model.getDataHelper(), "load").andCallFake(function() {});
        model.set({year: 1960});

        expect(model.get("year")).toEqual(1960);
    });

    it("should be able to find fraction of the year, when the year is in double integer format", function() {
        var model = new gapminder.bubbleChartModel();

        spyOn(model.getDataHelper(), "load").andCallFake(function() {});
        model.set({year: 1965.5});

        expect(model.get("fraction")).toEqual(0.5);
    });

    it("should be able to find the previous year value after the model 'year' attribute is set", function() {
        var model = new gapminder.bubbleChartModel();

        spyOn(model.getDataHelper(), "load").andCallFake(function() {});
        model.set({year: 1965.5});

        expect(model.get("prevYear")).toEqual(1965);
    });

    it("should be able to find the next year value after the model 'year' attribute is set", function() {
        var model = new gapminder.bubbleChartModel();

        spyOn(model.getDataHelper(), "load").andCallFake(function() {});
        model.set({year: 1965.5});

        expect(model.get("nextYear")).toEqual(1966);
    });

});


