function GleipnirMonitor() {
    this.isEnabled = false;
    
    this.gaugeOptions = {
        chart: {
            type: 'solidgauge'
        },
        title: null,
        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        tooltip: {
            enabled: false
        },
        yAxis: {
            stops: [
                [0.1, '#55BF3B'],
                [0.5, '#DDDF0D'],
                [0.9, '#DF5353']
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };
    
    this.initializeMemoryCharts = function(consumedMemory, allocatedMemory, maxMemory) {
        this.isEnabled = true;
        $('#memory-gauge').highcharts(Highcharts.merge(this.gaugeOptions, {
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'Memory Consumption'
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Memory Consumption',
                // Coefficients : 10^decimalPlaces * chartMax * consumedMemory * percent / maxMemory
                data: [consumedMemory * 100 / maxMemory],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.2f}</span><br/>' +
                           '<span style="font-size:12px;color:silver">%</span></div>'
                },
                tooltip: {
                    valueSuffix: ' %'
                }
            }]
        }));
        this.updateMemoryCharts(consumedMemory, allocatedMemory, maxMemory);
    };
    this.updateMemoryCharts = function(consumedMemory, allocatedMemory, maxMemory) {
        
        var chart = $('#memory-gauge').highcharts();
        var point = chart.series[0].points[0];
        // Coefficients : 10^decimalPlaces * chartMax * consumedMemory * percent / maxMemory
        point.update(consumedMemory * 100 / maxMemory);
        
        document.getElementById('memory-consumed').innerHTML = this.bytesToString(consumedMemory);
        document.getElementById('memory-allocated').innerHTML = this.bytesToString(allocatedMemory);
        document.getElementById('memory-max').innerHTML = this.bytesToString(maxMemory);
    };
    this.initializeCpuCharts = function(usedCpus, maxCpus) {
        this.isEnabled = true;
        $('#cpu-gauge').highcharts(Highcharts.merge(this.gaugeOptions, {
            yAxis: {
                min: 0,
                max: maxCpus,
                title: {
                    text: 'Used CPUs'
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Memory Consumption',
                // Coefficients : 10^decimalPlaces * chartMax * usedCpus * percent / maxCpus
                data: [usedCpus],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                           '<span style="font-size:12px;color:silver">cores</span></div>'
                },
                tooltip: {
                    valueSuffix: ' cores'
                }
            }]
        }));
    };
    this.updateCpuCharts = function(usedCpus, maxCpus) {
        var chart = $('#cpu-gauge').highcharts();
        var point = chart.series[0].points[0];
        // Coefficients : 10^decimalPlaces * chartMax * usedCpus * percent / maxCpus
        point.update(usedCpus);
    };
    this.showServices = function(services) {
        var serviceName;
        var serviceId;
        var collapse;
        var html = '';
        
        for(serviceName in services) {
            serviceId = serviceName.replace(" ", "");
            html +=
                '<div id="service-' + serviceId + '">' +
                '<h4 class=list-group-item-heading">' + serviceName + '</h4>' +
                '<div id="service-' + serviceId +'-accordion" class="panel-group">'
            ;
            services[serviceName].forEach(function(service, i) {
                collapse = (i === 0) ? " in" : "";
                
                html += '<div class="panel panel-default">';
                html += '<div class="panel-heading"><h4 class="panel-title">';
                html += '<a data-toggle="collapse" data-parent="#service-' + serviceId +'-accordion" href="#service-instance-' + service.port + '">';
                html += 'Port : ' + service.port + '</a></h4></div>';
                html += '<div id="service-instance-' + service.port + '" class="panel-collapse collapse' + collapse + '">';
                html += '<div class="panel-body"><table class="table">';
                html += '<tr><td>Consumed Memory :</td><td>' + service.consumed_memory + '</td></tr>';
                html += '<tr><td>Allocated Memory :</td><td>' + service.allocated_memory + '</td></tr>';
                html += '<tr><td>Started At :</td><td>' + service.started_at + '</td></tr>';
                html += '<tr><td>Updated At :</td><td>' + service.updated_at + '</td></tr>';
                html += '</table></div></div></div>';
            });
            html += '</div></div>';
        }
        document.getElementById('services-list').innerHTML = html;
    };
    this.setCheckbox = function(checkboxId, isChecked) {
        var checkbox = document.getElementById(checkboxId).firstElementChild;
        var onclickCallback =
            (isChecked === true)
            ? checkbox.getAttribute('data-on')
            : checkbox.getAttribute('data-off')
        ;
        
        checkbox.checked = isChecked;
        checkbox.setAttribute('onclick', "kernel." + onclickCallback + "()");
    };
    this.bytesToString = function(bytes) {    
        var currentUnit = 0;
        var unitIndex = 0;
        var string = "";
        var units = [
            "B",
            "Kb",
            "Mb",
            "Go"
        ];

        do{
            currentUnit = bytes % 1024;
            bytes = (bytes - currentUnit) / 1024;

            if(currentUnit > 0) {
                string = currentUnit + units[unitIndex] + " " + string;
            }
            unitIndex++;

        }while(unitIndex < 3);

        if(string === "") {
            string = "0B";
        }
        return string;
    };
}