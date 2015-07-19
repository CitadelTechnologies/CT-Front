var kernel = new Kernel();

window.onload = function(e) {
    e.preventDefault();
    
    kernel.initialize();
};

function Kernel() {
    this.monitor;
    
    this.isRunning = false;
    this.isAlive = true;
    this.refreshInterval = null;
    
    this.services = null;
    this.memory = {
        consumed: 0,
        allocated: 0,
        gc: {
           enabled: false,
           last: 0,
           next: 0,
           num: 0
        }
    };
    this.cpu = {
        used: 0,
        max: 0
    };
    this.initialize = function() {
        this.monitor = new GleipnirMonitor();
        this.connect();
    };
    this.connect = function() {
        this.isAlive = true;
        this.monitor.setCheckbox("engine-checkbox", true);
        
        this.refreshStatus();
        this.refreshInterval = setInterval(this.refreshStatus, 2000);
    };
    this.shutdown = function() {
        clearInterval(this.refreshInterval);
        this.isAlive = false;
        this.isRunning = false;
        
        this.monitor.setCheckbox("engine-checkbox", false);
        this.monitor.setCheckbox("services-checkbox", false);
        
        this.monitor.showServices([]);
        this.monitor.updateCpuCharts(0, this.cpu.max);
        this.monitor.updateMemoryCharts(0, 0, 0);
    };
    this.shutdownKernel = function() {
        xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:6600/shutdown", true);
        xhr.timeout = 4000;
        xhr.ontimeout = function() {
            kernel.shutdown();
        };
        xhr.onreadystatechange = function(e) {
            if(xhr.readyState === 4) {
                if(xhr.status !== 200 && xhr.status !== 0) {
                    console.error("error : " +  xhr.responseText);
                }
                kernel.shutdown();
            }
        };
        xhr.send();
    };
    this.runKernel = function() {
        
        xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:6600/run", true);
        xhr.timeout = 200;
        xhr.onreadystatechange = function(e) {
            if(xhr.readyState === 4) {
                if(xhr.status !== 200 && xhr.status !== 0) {
                    console.error("error : " +  xhr.responseText);
                }
                kernel.launchServices();
            }
        };
        xhr.send();
    };
    this.launchServices = function() {
        this.monitor.setCheckbox('services-checkbox', true);
    };
    this.shutdownKernelServices = function() {
        xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:6600/shutdownServices", true);
        xhr.timeout = 200;
        xhr.onreadystatechange = function(e) {
            if(xhr.readyState === 4) {
                if(xhr.status !== 200 && xhr.status !== 0) {
                    console.error("error : " +  xhr.responseText);
                }
                kernel.shutdownServices();
            }
        };
        xhr.send();
    };
    this.shutdownServices = function() {
        this.monitor.setCheckbox('services-checkbox', false);
    };
    this.refreshStatus = function() {
        if(this.isAlive === false) {
            return;
        }
        xhr = new XMLHttpRequest();
        xhr.open("GET", "http://127.0.0.1:6600/status", true);
        xhr.timeout = 100;
        xhr.ontimeout = function() {
            kernel.shutdown();
        };
        xhr.onreadystatechange = function(e) {
            if(xhr.readyState === 4) {
                if(xhr.status !== 200 && xhr.status !== 0) {
                    console.error("error : " +  xhr.responseText);
                }
                kernel.updateStatus(JSON.parse(xhr.responseText));
            }
        };
        xhr.send();
    };
    this.updateStatus = function(data) {
    
        this.isRunning = data.is_running;
        this.monitor.setCheckbox("services-checkbox", data.is_running);
        
        this.memory.consumed = data.memory.HeapAlloc;
        this.memory.allocated = data.memory.HeapSys;
        this.memory.max = data.max_memory;
        
        this.memory.gc.enabled = data.memory.EnableGC;
        this.memory.gc.last = data.memory.LastGC;
        this.memory.gc.next = data.memory.NextGC;
        this.memory.gc.num = data.memory.NumGC;
        
        this.cpu.used = data.used_cpus;
        this.cpu.max = data.cpus_number;
        
        this.services = data.services;
        this.monitor.showServices(data.services);
        
        if(this.monitor.isEnabled === false) {
            this.monitor.initializeCpuCharts(this.cpu.used, this.cpu.max);
            this.monitor.initializeMemoryCharts(this.memory.consumed, this.memory.allocated, this.memory.max);
            return;
        }
        this.monitor.updateCpuCharts(this.cpu.used, this.cpu.max);
        this.monitor.updateMemoryCharts(this.memory.consumed, this.memory.allocated, this.memory.max);
    };
}


