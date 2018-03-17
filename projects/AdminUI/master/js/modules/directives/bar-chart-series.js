/**=========================================================
* smangipudi
 * Module: stacked-bar-chart.js
*
 =========================================================*/
App.directive('seriesBarChart', function () {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        scope: {
            url: '@',
            id: '@',
            mode: '@',
            formatDataFx: '&',
            chartData: '@',
            yAxisFormatter: '&'
        },
        link: function (scope, element, attrs) {

            scope.yFn = angular.isUndefined(attrs.yAxisFormatter) === false;
            if (typeof scope.url !== 'undefined' && scope.url.length > 0) {
                scope.$watch('url', function (newValue, oldValue) {
                    if (!newValue || angular.equals(newValue, oldValue)) {
                        return;
                    }

                    scope.drawChart();
                });
            } else {
                scope.$watch('chartData', function (newValue, oldValue) {
                    if (!newValue || angular.equals(newValue, oldValue)) {
                        return;
                    }
                    scope.drawChart();
                });
            }
        },
        controller: function ($scope) {
            console.log("Location data-->:", $scope.url);
            $scope.chart = new FlotChart($('#' + $scope.id), null);
            $scope.option = {
                series: {
                    bars: {
                        show: true,
                        barWidth: 0.15,
                        align: 'center'
                    }
                },
                grid: {
                    borderColor: '#eee',
                    borderWidth: 1,
                    hoverable: true,
                    backgroundColor: '#fcfcfc'
                },
                tooltip: true,
                tooltipOpts: {
                    content: '%y'
                },
                xaxis: {
                    tickColor: '#fcfcfc',
                    mode: 'categories'
                },
                yaxis: {
                    tickColor: '#eee',
                    tickDecimals: 0,
                    tickFormatter: function (val, axis) {
                        if ($scope.yFn) {
                            return $scope.yAxisFormatter({ val: val });
                        }
                        return val;
                    }

                },
                shadowSize: 0
            };

            $scope.drawChart = function (data) {
                console.log("Options:", $scope.chartData);
                $scope.option.xaxis.mode = $scope.mode;
                if ($scope.mode === 'time') {
                    $scope.option.series.bars.lineWidth = 1;
                } else {
                    $scope.option.xaxis.mode = 'categories';
                }

                if (typeof $scope.url !== 'undefined' && $scope.url.length > 0) {
                    $scope.chart.setDataUrl($scope.url);
                    $scope.chart.requestData($scope.option, 'GET', null, $scope.formatDataFx, true);
                } else {
                    $scope.chart.setData($scope.option, JSON.parse($scope.chartData));
                }

            };

            $scope.formatDataForD3JS = function (data) {
                var response = data[0];

                var categorieNames = response.ticks.map(function (item) {
                    return item[1];
                });
                var dataValues = [];
                categorieNames.forEach(function (categorie) {
                    var obj = {};
                    obj.categorie = categorie;
                    obj.values = [];
                    var value = response.series.map(function (item) {
                        var e = item.data.filter(function (c) { return c[0] === categorie });
                        if (e.length > 0) return e[0].pop();
                        else return 0;
                    });
                    var rate = response.series.map(function (elem) { return elem.subName });
                    for (var index = 0; index < value.length; index++) {
                        var v = { "value": value[index], "rate": rate[index] };
                        obj.values.push(v);
                    }
                    dataValues.push(obj);
                });

                // console.log("MyData:",dataValues); 
                return dataValues;
            }

            $scope.drawChart();
        }

    };

});


App.directive('njBarChart', function () {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        scope: {
            parameter: '@'
        },
        link: function (scope, element, attrs) {

            scope.$watch('parameter', function (newValue, oldValue) {
                console.log("Chart value:", newValue);
                scope.drawD3Js(newValue);
            });
        }, controller: function ($scope) {
            $scope.drawD3Js = function (data) {
                console.log("Inside d3")
                var margin = { top: 20, right: 20, bottom: 30, left: 40 },
                    width = 960 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom;

                var x0 = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                var x1 = d3.scale.ordinal();

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x0)
                    .tickSize(0)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var color = d3.scale.ordinal()
                    .range(["#ca0020", "#f4a582", "#d5d5d5", "#92c5de", "#0571b0", "#FF8C00", "#6B486B"]);
                d3.select("svg").remove();
                var svg = d3.select('#visitorsChartReasonD3').append("svg")
                    .classed("svg-container", true)
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 960 400")
                    .classed("svg-content-responsive", true)
                    // .attr("width", width + margin.left + margin.right)
                    // .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var fullJson = JSON.parse(data);
                console.log("Json data:", angular.toJson(fullJson));
                var response = fullJson[0];
                var categorieNames = response.ticks.map(function (item) {
                    return item[1];
                });
                var dataValues = [];
                categorieNames.forEach(function (categorie) {
                    var obj = {};
                    obj.categorie = categorie;
                    obj.values = [];
                    var value = response.series.map(function (item) {
                        var e = item.data.filter(function (c) { return c[0] === categorie });
                        if (e.length > 0) return e[0].pop();
                        else return 0;
                    });
                    var rate = response.series.map(function (elem) { return elem.subName });
                    for (var index = 0; index < value.length; index++) {
                        if(rate[index] !== "") {
                            var v = { "value": value[index], "rate": rate[index] };
                            obj.values.push(v);
                        }
                    }
                    dataValues.push(obj);
                });

                // console.log("MyData:", dataValues);

                var categoriesNames = dataValues.map(function (d) { return d.categorie; });
                var rateNames = dataValues[0].values.map(function (d) { return d.rate; });

                x0.domain(categoriesNames);
                x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
                y.domain([0, d3.max(dataValues, function (categorie) { return d3.max(categorie.values, function (d) { return d.value; }); })]);


                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("y", -5)
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", function (d) {
                        return "rotate(-65)"
                    });

                svg.append("g")
                    .attr("class", "y axis")
                    .style('opacity', '0')
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .style('font-weight', 'bold')
                    .text("");

                svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

                var slice = svg.selectAll(".slice")
                    .data(dataValues)
                    .enter().append("g")
                    .attr("class", "g")
                    .attr("transform", function (d) { return "translate(" + x0(d.categorie) + ",0)"; });

                slice.selectAll("rect")
                    .data(function (d) { return d.values; })
                    .enter().append("rect")
                    .attr("width", x1.rangeBand())
                    .attr("x", function (d) { return x1(d.rate); })
                    .style("fill", function (d) { return color(d.rate) })
                    .attr("y", function (d) { return y(0); })
                    .attr("height", function (d) { return height - y(0); })
                    .on("mouseover", function (d) {
                        d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
                    })
                    .on("mouseout", function (d) {
                        d3.select(this).style("fill", color(d.rate));
                    });

                slice.selectAll("rect")
                    .transition()
                    .delay(function (d) { return Math.random() * 1000; })
                    .duration(1000)
                    .attr("y", function (d) { return y(d.value); })
                    .attr("height", function (d) { return height - y(d.value); });

                //Legend
                var legend = svg.selectAll(".legend")
                    .data(dataValues[0].values.map(function (d) { return d.rate; }).reverse())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
                    .style("opacity", "0");

                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", function (d) { return color(d); });

                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function (d) { return d; });

                legend.transition().duration(500).delay(function (d, i) { return 1300 + 100 * i; }).style("opacity", "1");
            }

        }
    };

});
