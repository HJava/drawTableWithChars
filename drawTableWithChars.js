(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root['drawTables'] = factory();
    }
})(this, function() {
    function draw(data) {//draw the table according to each line content;
        var lines = getLines(data);
        var div = document.createElement('div');
        var length = lines.length;
        for(var i = 0; i < length; i++) {
            var line = document.createElement('div');
            line.innerHTML = lines[i];
            div.appendChild(line);
        }
        return div;
    }

    function getLines(table) {//get each line content array about the table,including word and line
        var standardData = formatData(table);
        var columnQueue = getColumnQueue(standardData);
        var maxLength = getMaxLength(columnQueue);
        var lines = [];
        var length = columnQueue.length;
        var bigData = getBigData(standardData);
        standardData.direction = getDirections(table.title, table.direction, maxLength.length);
        lines.push(drawUpBorder(maxLength));
        for(var i = 0; i < length - 1; i++) {
            lines.push(drawContent(columnQueue[i], maxLength, standardData.direction));
            lines.push(drawLines(maxLength));
        }
        lines.push(drawContent(columnQueue[length - 1], maxLength, standardData.direction));
        lines.push(drawDownBorder(maxLength));
        return merge(lines, bigData, maxLength);
    }

    function formatData(table) {//format all data in title and data to standard form
        var result = {};
        result.direction = table.direction;
        var titleLength = table.title ? table.title.length : 0;
        var dataLength = table.data.length;
        var title = [];
        var data = [];
        var column = [];
        for(var i = 0; i < titleLength; i++) {
            title[i] = changeDataToObject(table.title[i], true);
        }

        for(var i = 0; i < dataLength; i++) {
            column = [];
            for(var j = 0; j < table.data[i].length; j++) {
                column[j] = changeDataToObject(table.data[i][j], false);
            }
            data[i] = column;
        }
        result.title = title;
        result.data = data;
        return result;
    }


    function getColumnQueue(table) {//change line array to a convenient array which son array has the same length and draw easily
        var result = [];
        var title = table.title;
        var data = table.data;
        var column = [];
        var dataLine = [];
        var titleLength = title.length;
        var dataLength = data.length;
        for(var i = 0; i < titleLength; i++) {
            column.push(title[i].content);
            for(var j = 1; j < title[i].col; j++) {
                column.push(null);
            }
        }
        for(var i = 0; i < dataLength; i++) {
            if(result[i] === undefined) {
                result[i] = [];
            }

            for(var j = 0; j < data[i].length; j++) {
                var point = 0;
                var count = result[i].length;
                while(result[i][point] !== undefined) {
                    point++;
                }
                result[i][point] = data[i][j].content;

                for(var k = 1; k < data[i][j].col; k++) {
                    result[i][point + k] = null;
                }
                for(var k = 1; k < data[i][j].row; k++) {
                    if(result[i + k] === undefined) {
                        result[i + k] = [];
                        if(count !== 0) {
                            for(var m = 0; m < count; m++) {
                                result[i + k].push(undefined);
                            }
                        }
                    }
                    for(var m = 0; m < data[i][j].col; m++) {
                        result[i + k].push(null);
                    }
                }
            }
        }
        if(titleLength !== 0) {
            result.unshift(column);
        }
        var max = result[0].length;
        var resultLength = result.length;
        for(var i = 0; i < resultLength; i++) {
            if(result[i].length > max) {
                max = result[i].length;
            }
        }
        for(var i = 0; i < resultLength; i++) {
            for(var j = result[i].length; j < max; j++) {
                result[i].push(null);
            }
        }
        return result;
    }

    function getMaxLength(columnQueue) {//get the max length of all line array to decide the width
        var result = [];
        var length = columnQueue.length;
        for(var i = 0; i < length; i++) {
            for(var j = 0; j < columnQueue[i].length; j++) {
                if(result[j] === undefined) {
                    result[j] = 0;
                }
                if(columnQueue[i][j] === undefined || columnQueue[i][j] === null) {
                    continue;
                } else {
                    var strLength = strlen(columnQueue[i][j]);
                    if(strLength > result[j]) {
                        result[j] = strLength;
                    }
                }
            }
        }
        return result;
    }

    function getBigData(data) {//get the data where col !=1 or row != 1
        var result = [];
        var title = data.title;
        var titleLength = data.title.length;
        var titleOffset = (titleLength === 0 ? 0 : 1);
        var data = data.data;
        for(var i = 0; i < titleLength; i++) {
            if(title[i].col !== 1 || title[i].row !== 1) {
                result.push({location: 1, data: title[i]});
            }
        }
        for(var i = 0; i < data.length; i++) {
            for(var j = 0; j < data[i].length; j++) {
                if(data[i][j] !== null) {
                    if(data[i][j].col !== 1 || data[i][j].row !== 1) {
                        result.push({location: (i + titleOffset) * 2 + 1, data: data[i][j]});
                    }
                }
            }
        }
        return result;
    }

    function getDirections(title, direction, length) {//change direction array to the standard array
        var result = [];
        switch(Object.prototype.toString.apply(direction)) {
            case '[object Boolean]':
            {
                for(var i = 0; i < length; i++) {
                    result[i] = direction;
                }
            }
                break;
            case '[object Array]':
            {
                if(direction.length !== 0) {
                    for(var i = 0; i < length; i++) {
                        if(direction.indexOf(i) > -1) {
                            result[i] = false;
                        } else {
                            result[i] = true;
                        }
                    }
                    for(var i = 0; i < length; i++) {
                        if(direction.indexOf(title[i]) > -1) {
                            result[i] = false;
                        }
                    }
                } else {
                    for(var i = 0; i < length; i++) {
                        result[i] = true;
                    }
                }
            }
                break;
            default :
            {
                for(var i = 0; i < length; i++) {
                    result[i] = true;
                }
            }

        }
        return result;
    }

    function drawContent(datum, maxLength, direction) {//change data to a line array
        var result = '';
        var length = datum.length;
        for(var i = 0; i < length; i++) {
            if(datum[i] === null) {
                result += '| ' + fillSpace(maxLength[i]) + ' ';
            } else {
                result += '| ' + fillContent(datum[i], maxLength[i], direction[i]) + ' ';
            }
            if(i === length - 1) {
                result += '|';
            }
        }
        return result;
    }

    function drawUpBorder(maxLength) {
        var length = maxLength.length;
        var spaceLength = 0;
        for(var i = 0; i < length; i++) {
            spaceLength += maxLength[i] + 3;
        }
        var result = '|' + fillLine(spaceLength - 1) + '|';
        return result;
    }

    function drawDownBorder(maxLength) {
        var length = maxLength.length;
        var spaceLength = 0;
        for(var i = 0; i < length; i++) {
            spaceLength += maxLength[i] + 3;
        }
        var result = '|' + fillLine(spaceLength - 1) + '|';
        return result;
    }

    function drawLines(maxLength) {//draw line between data
        var length = maxLength.length;
        var result = '';
        for(var i = 0; i < length; i++) {
            result += '|-' + fillLine(maxLength[i]) + '-';
        }
        result += '|';
        return result;
    }

    function merge(lines, bigData, maxLength) {//merge the cells according to the special data
        var result = [];
        var finished = [];
        for(var i = 0; i < lines.length; i++) {
            result[i] = lines[i];
        }
        for(var i = 0; i < bigData.length; i++) {
            var location = bigData[i].location;
            var content = bigData[i].data.content;
            var col = bigData[i].data.col;
            var row = bigData[i].data.row;
            var point = 0;
            var contentStart = 0;
            var finishedLocation = -1;
            for(var j = 0; j < finished.length; j++) {
                if(location == finished[j].location && content === finished[j].content) {
                    contentStart = finished[j].point + 1;
                    finishedLocation = j;
                    break;
                }
            }
            var start = result[location].indexOf(content, contentStart);
            for(var j = 0; j < (row * 2) - 1; j++) {
                for(var k = 0; k < col - 1; k++) {//change '|' to space
                    var point = result[location + j].indexOf('|', start);
                    result[location + j] = changeWord(result[location + j], point, point + 1, ' ');
                }
                if(j % 2 === 1) {
                    var first = findFrontFlag(result[location + j], '|', start);
                    var point = result[location + j].indexOf('|', start);
                    result[location + j] = changeWord(result[location + j], first + 1, point, fillSpace(point - first - 1));
                }
            }

            if(contentStart === 0) {
                finished.push({content: content, location: location, point: start});
            } else {
                finished[finishedLocation].point = start;
            }
        }

        for(var i = 0; i < lines.length; i++) {
            result[i] = result[i].replace(/ /gi, '&nbsp');
        }
        return result;
    }

    function changeDataToObject(datum, flag) {//change datum to the standard form:{content:'xxx',col:x,row:x}
        var result = {};
        switch(Object.prototype.toString.apply(datum)) {
            case '[object Object]':
            {
                result = {
                    content: (datum.content || ''),
                    col: (datum.col || 1),
                    row: (datum.row || 1)
                }
            }
                break;
            case '[object String]':
            {
                result = {content: datum, col: 1, row: 1};
            }
                break;
            case '[object Number]':
            case '[object Boolean]':
            {
                result = {content: datum.toString(), col: 1, row: 1};
            }
                break;
            default :
            {
                result = {content: '', col: 1, row: 1};
            }

        }
        if(flag === true) {
            result.row = 1;
        }
        return result;
    }

    function findFrontFlag(string, flag, start) {//find the first flag before start in the string
        for(var i = start; i >= 0; i--) {
            if(string[i] === flag) {
                return i;
            }
        }
        return -1;
    }

    function changeWord(string, start, end, newWord) {//change some words from the string
        return string.substring(0, start) + newWord + string.substring(end);
    }

    function fillLine(length) {//create line according to the length
        var result = '';
        for(var i = 0; i < length; i++) {
            result += '-';
        }
        return result;
    }

    function fillSpace(length) {//create empty string according to the length
        var result = '';
        for(var i = 0; i < length; i++) {
            result += ' ';
        }
        return result;
    }

    function fillContent(value, length, direction) {//create fixed-length string,use direction to decide the location of space
        var value = value || '';
        var length = length;
        var direction = direction;
        var spaces = '';
        for(var i = strlen(value); i < length; i++) {
            spaces += ' ';
        }
        if(direction === true) {
            return value + spaces;
        } else {
            return spaces + value;
        }
    }


    function strlen(str) {
        return str.replace(/[^\x00-\xff]/g, "**").length;
    }

    return {
//        example table data is below
        table: {
//            standard object:{content:'xxx',col:x,row:x}--content, col and row is not necessary
            title: ['name', 'age', 'sex'],//string or boolean or number or standard object
            direction: [0, 'age'],//number or string in title,alignment-Right
            data: [
                ['haasdfha', 10, {content: 'heihei', col: 4, row: 3}],//the same to title
                ['hehe', 10],
                ['haasdfha', 10, 'male'],
                [
                    {content: 'heihei', col: 4, row: 3},
                    {content: 'heihei', col: 4, row: 3},
                ],
                [
                    {content: 'heihei', col: 4, row: 3},
                    {}
                ]
            ]
        },
        init: function(ctn, data) {
            ctn = ctn || document.getElementsByTagName('body')[0];
            if(Object.prototype.toString.apply(data) === '[object Object]') {
                ctn.appendChild(draw(data));
            } else {
                ctn.appendChild(draw(this.table));
                console.log('Data is Error,Draw the Emample Table!');
            }
        }
    }
});