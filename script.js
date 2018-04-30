(function() {

    class ObjStorage {
        static set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }

        static get(key) {
            var value = localStorage.getItem(key);
            return value && JSON.parse(value);
        }

        static test() {
            ObjStorage.set('test', { 'one': 1, 'two': 2, 'three': 3 });
            console.log(ObjStorage.get('test'));
        }
    }

    class JSONDate {
        static now() {
            var date = new Date();
            //date.setDate(31);
            var jsonDate = date.toJSON(); // UTC
            return jsonDate;
        }

        static backToDate(jsonDate) {
            var backToDate = new Date(jsonDate);
            return backToDate;
        }

        static getDate(jsonDate) {
            //return jsonDate.substring(0, 10);
            var date = JSONDate.backToDate(jsonDate);
            //return date.toLocaleDateString();
            var yyyy = date.getFullYear();
            var mm = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
            var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
            return yyyy + '-' + mm + '-' + dd;
        }

        static getTime(jsonDate) {
            //return jsonDate.substring(11, 19);
            var date = JSONDate.backToDate(jsonDate);
            return date.toLocaleTimeString();
        }

        static test() {
            var jsonDate = JSONDate.now()
            console.log(Date())
            console.log(jsonDate)
            console.log(JSONDate.backToDate(jsonDate))
        }
    }

    class Logger {    
        static logs(key) {
            var logs = ObjStorage.get(key);
            return logs || [];
        }

        static log(key, cb) {
            var logs = Logger.logs(key);
            var date = JSONDate.now();

            // prepend the date
            logs.unshift(date);

            ObjStorage.set(key, logs);
        
            cb(logs);
        }
        
        static dailyStats(logs) {
            var stats = {};
            
            // group logs by date (aaaa-mm-dd)
            stats = logs.reduce( (stats, curr) => {
                var date = JSONDate.getDate(curr);
                stats[date] = stats[date] ? (stats[date] + 1) : 1;
                return stats;
            }, stats);

            return stats;
        }
    }

    /*
    class LogTypes {
        static types() {
            var logTypes = localStorage.logs.split(',');
            return logTypes;
        }

        static select(log_idx) {
            var logTypes = LogTypes.types();
            return logTypes[log_idx];
        }
    }*/

    /*
    function renderClickCount(clickcount, $el) {
        $el.innerHTML = 'You have clicked the button ' + clickcount + ' time(s).';
    }*/

    function renderLogs(logs, $el) {
        var html = '';

        logs.forEach(jsonDate => {
            //console.log(jsonDate);
            //var date = JSONDate.backToDate(jsonDate);
            //var dateTime = date.toLocaleString();
            var dateTime = JSONDate.getDate(jsonDate) + ', ' + JSONDate.getTime(jsonDate);
            
            html += '<li>' + dateTime + '</li>';
        });
        
        $el.innerHTML = html;
    }

    function renderDailyStats(logs, $el) {
        var html = '';

        var stats = Logger.dailyStats(logs);

        //console.log(logs)
        //console.log(stats);

        for (let date in stats) {
            //console.log(date); 
            html += '<tr>';
            html += '<td>' + date + '</td>';
            html += '<td>' + stats[date] + '</td>';
            html += '</tr>';
        }

        $el.innerHTML = html;
    }

    function render(props={}) {
        var logs = props.logs || Logger.logs(_log);
        //renderClickCount(props.clickcount, $clickCount);
        renderLogs(logs, $logs);
        renderDailyStats(logs, $stats);
    }

    function log() {
        /*
        if (localStorage.clickcount) {
            localStorage.clickcount = Number(localStorage.clickcount) + 1;
        } 
        else {
            localStorage.clickcount = 1;
        }
        */

        Logger.log(_log, (logs) => {
            render({
                'logs': logs,
                //'clickcount': localStorage.clickcount
            });
        });
    }

    function switchLogger(evt) {
        //console.log(evt.target.value);
        _log = evt.target.value;

        $btnLog.innerHTML = evt.target.value.toUpperCase() + '!';

        render();
    }

    function initRadio() {
        //var logTypes = LogTypes.types();
        //var html = '';
        //logTypes.forEach((logType) => {});

        $logType.innerHTML = ""+
        "<input type=\"radio\" name=\"log\" value=\"log\" checked=\"checked\"> Log<br>" +
        "<input type=\"radio\" name=\"log\" value=\"log_2\"> Log_2<br>";

        $logType.addEventListener('change', switchLogger);
    }
    
    function init() {
        if(typeof(Storage) !== 'undefined') {
            $logType = document.getElementById('logType');
            $btnLog = document.getElementById('btnLog');
            //$clickCount = document.getElementById('clickCount');
            $logs = document.getElementById('logs');
            $stats = document.getElementById('stats');

            $btnLog.addEventListener('click', log);

            //initRadio();

            render();

            /*
            render({
                'logs': Logger.logs(_log),
                //'clickcount': localStorage.clickcount
            });*/

            //JSONDate.test();
            //ObjStorage.test();
        } else {
            alert('Sorry, your browser does not support web storage...');
        }
    }

    function _init() {
        //localStorage.logs = ['log', 'log_2'];
    
        _log = 'log'; //LogTypes.select(0);
        document.addEventListener('DOMContentLoaded', init, false);
    }


    var $logType, $btnLog, /*$clickCount,*/ $logs, $stats;

    var _log;

    _init();

})();