module.exports = [
"[project]/node_modules/mml-react/node_modules/micromark/dist/constant/assign.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var assign = Object.assign;
module.exports = assign;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/constant/has-own-property.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var own = {}.hasOwnProperty;
module.exports = own;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/normalize-identifier.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function normalizeIdentifier(value) {
    return value // Collapse Markdown whitespace.
    .replace(/[\t\n\r ]+/g, ' ') // Trim.
    .replace(/^ | $/g, '') // Some characters are considered “uppercase”, but if their lowercase
    // counterpart is uppercased will result in a different uppercase
    // character.
    // Hence, to get that form, we perform both lower- and uppercase.
    // Upper case makes sure keys will not interact with default prototypal
    // methods: no object method is uppercase.
    .toLowerCase().toUpperCase();
}
module.exports = normalizeIdentifier;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/constant/from-char-code.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var fromCharCode = String.fromCharCode;
module.exports = fromCharCode;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/safe-from-int.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var fromCharCode = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/from-char-code.js [app-ssr] (ecmascript)");
function safeFromInt(value, base) {
    var code = parseInt(value, base);
    if (// C0 except for HT, LF, FF, CR, space
    code < 9 || code === 11 || code > 13 && code < 32 || code > 126 && code < 160 || code > 55295 && code < 57344 || code > 64975 && code < 65008 || (code & 65535) === 65535 || (code & 65535) === 65534 || // Out of range
    code > 1114111) {
        return '\uFFFD';
    }
    return fromCharCode(code);
}
module.exports = safeFromInt;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function markdownLineEnding(code) {
    return code < -2;
}
module.exports = markdownLineEnding;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-space.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function markdownSpace(code) {
    return code === -2 || code === -1 || code === 32;
}
module.exports = markdownSpace;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-space.js [app-ssr] (ecmascript)");
function spaceFactory(effects, ok, type, max) {
    var limit = max ? max - 1 : Infinity;
    var size = 0;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        if (markdownSpace(code)) {
            effects.enter(type);
            return prefix(code);
        }
        return ok(code);
    }
    function prefix(code) {
        if (markdownSpace(code) && size++ < limit) {
            effects.consume(code);
            return prefix;
        }
        effects.exit(type);
        return ok(code);
    }
}
module.exports = spaceFactory;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/initialize/content.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var tokenize = initializeContent;
function initializeContent(effects) {
    var contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
    var previous;
    return contentStart;
    //TURBOPACK unreachable
    ;
    function afterContentStartConstruct(code) {
        if (code === null) {
            effects.consume(code);
            return;
        }
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return factorySpace(effects, contentStart, 'linePrefix');
    }
    function paragraphInitial(code) {
        effects.enter('paragraph');
        return lineStart(code);
    }
    function lineStart(code) {
        var token = effects.enter('chunkText', {
            contentType: 'text',
            previous: previous
        });
        if (previous) {
            previous.next = token;
        }
        previous = token;
        return data(code);
    }
    function data(code) {
        if (code === null) {
            effects.exit('chunkText');
            effects.exit('paragraph');
            effects.consume(code);
            return;
        }
        if (markdownLineEnding(code)) {
            effects.consume(code);
            effects.exit('chunkText');
            return lineStart;
        } // Data.
        effects.consume(code);
        return data;
    }
}
exports.tokenize = tokenize;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/partial-blank-line.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var partialBlankLine = {
    tokenize: tokenizePartialBlankLine,
    partial: true
};
function tokenizePartialBlankLine(effects, ok, nok) {
    return factorySpace(effects, afterWhitespace, 'linePrefix');
    //TURBOPACK unreachable
    ;
    function afterWhitespace(code) {
        return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
    }
}
module.exports = partialBlankLine;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/initialize/document.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var partialBlankLine = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/partial-blank-line.js [app-ssr] (ecmascript)");
var tokenize = initializeDocument;
var containerConstruct = {
    tokenize: tokenizeContainer
};
var lazyFlowConstruct = {
    tokenize: tokenizeLazyFlow
};
function initializeDocument(effects) {
    var self = this;
    var stack = [];
    var continued = 0;
    var inspectConstruct = {
        tokenize: tokenizeInspect,
        partial: true
    };
    var inspectResult;
    var childFlow;
    var childToken;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        if (continued < stack.length) {
            self.containerState = stack[continued][1];
            return effects.attempt(stack[continued][0].continuation, documentContinue, documentContinued)(code);
        }
        return documentContinued(code);
    }
    function documentContinue(code) {
        continued++;
        return start(code);
    }
    function documentContinued(code) {
        // If we’re in a concrete construct (such as when expecting another line of
        // HTML, or we resulted in lazy content), we can immediately start flow.
        if (inspectResult && inspectResult.flowContinue) {
            return flowStart(code);
        }
        self.interrupt = childFlow && childFlow.currentConstruct && childFlow.currentConstruct.interruptible;
        self.containerState = {};
        return effects.attempt(containerConstruct, containerContinue, flowStart)(code);
    }
    function containerContinue(code) {
        stack.push([
            self.currentConstruct,
            self.containerState
        ]);
        self.containerState = undefined;
        return documentContinued(code);
    }
    function flowStart(code) {
        if (code === null) {
            exitContainers(0, true);
            effects.consume(code);
            return;
        }
        childFlow = childFlow || self.parser.flow(self.now());
        effects.enter('chunkFlow', {
            contentType: 'flow',
            previous: childToken,
            _tokenizer: childFlow
        });
        return flowContinue(code);
    }
    function flowContinue(code) {
        if (code === null) {
            continueFlow(effects.exit('chunkFlow'));
            return flowStart(code);
        }
        if (markdownLineEnding(code)) {
            effects.consume(code);
            continueFlow(effects.exit('chunkFlow'));
            return effects.check(inspectConstruct, documentAfterPeek);
        }
        effects.consume(code);
        return flowContinue;
    }
    function documentAfterPeek(code) {
        exitContainers(inspectResult.continued, inspectResult && inspectResult.flowEnd);
        continued = 0;
        return start(code);
    }
    function continueFlow(token) {
        if (childToken) childToken.next = token;
        childToken = token;
        childFlow.lazy = inspectResult && inspectResult.lazy;
        childFlow.defineSkip(token.start);
        childFlow.write(self.sliceStream(token));
    }
    function exitContainers(size, end) {
        var index = stack.length // Close the flow.
        ;
        if (childFlow && end) {
            childFlow.write([
                null
            ]);
            childToken = childFlow = undefined;
        } // Exit open containers.
        while(index-- > size){
            self.containerState = stack[index][1];
            stack[index][0].exit.call(self, effects);
        }
        stack.length = size;
    }
    function tokenizeInspect(effects, ok) {
        var subcontinued = 0;
        inspectResult = {};
        return inspectStart;
        //TURBOPACK unreachable
        ;
        function inspectStart(code) {
            if (subcontinued < stack.length) {
                self.containerState = stack[subcontinued][1];
                return effects.attempt(stack[subcontinued][0].continuation, inspectContinue, inspectLess)(code);
            } // If we’re continued but in a concrete flow, we can’t have more
            // containers.
            if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
                inspectResult.flowContinue = true;
                return inspectDone(code);
            }
            self.interrupt = childFlow.currentConstruct && childFlow.currentConstruct.interruptible;
            self.containerState = {};
            return effects.attempt(containerConstruct, inspectFlowEnd, inspectDone)(code);
        }
        function inspectContinue(code) {
            subcontinued++;
            return self.containerState._closeFlow ? inspectFlowEnd(code) : inspectStart(code);
        }
        function inspectLess(code) {
            if (childFlow.currentConstruct && childFlow.currentConstruct.lazy) {
                // Maybe another container?
                self.containerState = {};
                return effects.attempt(containerConstruct, inspectFlowEnd, effects.attempt(lazyFlowConstruct, inspectFlowEnd, effects.check(partialBlankLine, inspectFlowEnd, inspectLazy)))(code);
            } // Otherwise we’re interrupting.
            return inspectFlowEnd(code);
        }
        function inspectLazy(code) {
            // Act as if all containers are continued.
            subcontinued = stack.length;
            inspectResult.lazy = true;
            inspectResult.flowContinue = true;
            return inspectDone(code);
        } // We’re done with flow if we have more containers, or an interruption.
        function inspectFlowEnd(code) {
            inspectResult.flowEnd = true;
            return inspectDone(code);
        }
        function inspectDone(code) {
            inspectResult.continued = subcontinued;
            self.interrupt = self.containerState = undefined;
            return ok(code);
        }
    }
}
function tokenizeContainer(effects, ok, nok) {
    return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok, nok), 'linePrefix', this.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4);
}
function tokenizeLazyFlow(effects, ok, nok) {
    return factorySpace(effects, effects.lazy(this.parser.constructs.flow, ok, nok), 'linePrefix', this.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4);
}
exports.tokenize = tokenize;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/size-chunks.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Counts tabs based on their expanded size, and CR+LF as one character.
function sizeChunks(chunks) {
    var index = -1;
    var size = 0;
    while(++index < chunks.length){
        size += typeof chunks[index] === 'string' ? chunks[index].length : 1;
    }
    return size;
}
module.exports = sizeChunks;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/prefix-size.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var sizeChunks = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/size-chunks.js [app-ssr] (ecmascript)");
function prefixSize(events, type) {
    var tail = events[events.length - 1];
    if (!tail || tail[1].type !== type) return 0;
    return sizeChunks(tail[2].sliceStream(tail[1]));
}
module.exports = prefixSize;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/constant/splice.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var splice = [].splice;
module.exports = splice;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-splice.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var splice = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/splice.js [app-ssr] (ecmascript)");
// causes a stack overflow in V8 when trying to insert 100k items for instance.
function chunkedSplice(list, start, remove, items) {
    var end = list.length;
    var chunkStart = 0;
    var parameters // Make start between zero and `end` (included).
    ;
    if (start < 0) {
        start = -start > end ? 0 : end + start;
    } else {
        start = start > end ? end : start;
    }
    remove = remove > 0 ? remove : 0; // No need to chunk the items if there’s only a couple (10k) items.
    if (items.length < 10000) {
        parameters = Array.from(items);
        parameters.unshift(start, remove);
        splice.apply(list, parameters);
    } else {
        // Delete `remove` items starting from `start`
        if (remove) splice.apply(list, [
            start,
            remove
        ]); // Insert the items in chunks to not cause stack overflows.
        while(chunkStart < items.length){
            parameters = items.slice(chunkStart, chunkStart + 10000);
            parameters.unshift(start, 0);
            splice.apply(list, parameters);
            chunkStart += 10000;
            start += 10000;
        }
    }
}
module.exports = chunkedSplice;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/shallow.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var assign = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/assign.js [app-ssr] (ecmascript)");
function shallow(object) {
    return assign({}, object);
}
module.exports = shallow;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/subtokenize.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var assign = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/assign.js [app-ssr] (ecmascript)");
var chunkedSplice = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-splice.js [app-ssr] (ecmascript)");
var shallow = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/shallow.js [app-ssr] (ecmascript)");
function subtokenize(events) {
    var jumps = {};
    var index = -1;
    var event;
    var lineIndex;
    var otherIndex;
    var otherEvent;
    var parameters;
    var subevents;
    var more;
    while(++index < events.length){
        while(index in jumps){
            index = jumps[index];
        }
        event = events[index]; // Add a hook for the GFM tasklist extension, which needs to know if text
        // is in the first content of a list item.
        if (index && event[1].type === 'chunkFlow' && events[index - 1][1].type === 'listItemPrefix') {
            subevents = event[1]._tokenizer.events;
            otherIndex = 0;
            if (otherIndex < subevents.length && subevents[otherIndex][1].type === 'lineEndingBlank') {
                otherIndex += 2;
            }
            if (otherIndex < subevents.length && subevents[otherIndex][1].type === 'content') {
                while(++otherIndex < subevents.length){
                    if (subevents[otherIndex][1].type === 'content') {
                        break;
                    }
                    if (subevents[otherIndex][1].type === 'chunkText') {
                        subevents[otherIndex][1].isInFirstContentOfListItem = true;
                        otherIndex++;
                    }
                }
            }
        } // Enter.
        if (event[0] === 'enter') {
            if (event[1].contentType) {
                assign(jumps, subcontent(events, index));
                index = jumps[index];
                more = true;
            }
        } else if (event[1]._container || event[1]._movePreviousLineEndings) {
            otherIndex = index;
            lineIndex = undefined;
            while(otherIndex--){
                otherEvent = events[otherIndex];
                if (otherEvent[1].type === 'lineEnding' || otherEvent[1].type === 'lineEndingBlank') {
                    if (otherEvent[0] === 'enter') {
                        if (lineIndex) {
                            events[lineIndex][1].type = 'lineEndingBlank';
                        }
                        otherEvent[1].type = 'lineEnding';
                        lineIndex = otherIndex;
                    }
                } else {
                    break;
                }
            }
            if (lineIndex) {
                // Fix position.
                event[1].end = shallow(events[lineIndex][1].start); // Switch container exit w/ line endings.
                parameters = events.slice(lineIndex, index);
                parameters.unshift(event);
                chunkedSplice(events, lineIndex, index - lineIndex + 1, parameters);
            }
        }
    }
    return !more;
}
function subcontent(events, eventIndex) {
    var token = events[eventIndex][1];
    var context = events[eventIndex][2];
    var startPosition = eventIndex - 1;
    var startPositions = [];
    var tokenizer = token._tokenizer || context.parser[token.contentType](token.start);
    var childEvents = tokenizer.events;
    var jumps = [];
    var gaps = {};
    var stream;
    var previous;
    var index;
    var entered;
    var end;
    var adjust // Loop forward through the linked tokens to pass them in order to the
    ;
    // subtokenizer.
    while(token){
        // Find the position of the event for this token.
        while(events[++startPosition][1] !== token){
        // Empty.
        }
        startPositions.push(startPosition);
        if (!token._tokenizer) {
            stream = context.sliceStream(token);
            if (!token.next) {
                stream.push(null);
            }
            if (previous) {
                tokenizer.defineSkip(token.start);
            }
            if (token.isInFirstContentOfListItem) {
                tokenizer._gfmTasklistFirstContentOfListItem = true;
            }
            tokenizer.write(stream);
            if (token.isInFirstContentOfListItem) {
                tokenizer._gfmTasklistFirstContentOfListItem = undefined;
            }
        } // Unravel the next token.
        previous = token;
        token = token.next;
    } // Now, loop back through all events (and linked tokens), to figure out which
    // parts belong where.
    token = previous;
    index = childEvents.length;
    while(index--){
        // Make sure we’ve at least seen something (final eol is part of the last
        // token).
        if (childEvents[index][0] === 'enter') {
            entered = true;
        } else if (// Find a void token that includes a break.
        entered && childEvents[index][1].type === childEvents[index - 1][1].type && childEvents[index][1].start.line !== childEvents[index][1].end.line) {
            add(childEvents.slice(index + 1, end));
            // Help GC.
            token._tokenizer = token.next = undefined;
            token = token.previous;
            end = index + 1;
        }
    }
    // Help GC.
    tokenizer.events = token._tokenizer = token.next = undefined; // Do head:
    add(childEvents.slice(0, end));
    index = -1;
    adjust = 0;
    while(++index < jumps.length){
        gaps[adjust + jumps[index][0]] = adjust + jumps[index][1];
        adjust += jumps[index][1] - jumps[index][0] - 1;
    }
    return gaps;
    //TURBOPACK unreachable
    ;
    function add(slice) {
        var start = startPositions.pop();
        jumps.unshift([
            start,
            start + slice.length - 1
        ]);
        chunkedSplice(events, start, 2, slice);
    }
}
module.exports = subtokenize;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/content.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var prefixSize = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/prefix-size.js [app-ssr] (ecmascript)");
var subtokenize = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/subtokenize.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
// No name because it must not be turned off.
var content = {
    tokenize: tokenizeContent,
    resolve: resolveContent,
    interruptible: true,
    lazy: true
};
var continuationConstruct = {
    tokenize: tokenizeContinuation,
    partial: true
} // Content is transparent: it’s parsed right now. That way, definitions are also
;
// parsed right now: before text in paragraphs (specifically, media) are parsed.
function resolveContent(events) {
    subtokenize(events);
    return events;
}
function tokenizeContent(effects, ok) {
    var previous;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('content');
        previous = effects.enter('chunkContent', {
            contentType: 'content'
        });
        return data(code);
    }
    function data(code) {
        if (code === null) {
            return contentEnd(code);
        }
        if (markdownLineEnding(code)) {
            return effects.check(continuationConstruct, contentContinue, contentEnd)(code);
        } // Data.
        effects.consume(code);
        return data;
    }
    function contentEnd(code) {
        effects.exit('chunkContent');
        effects.exit('content');
        return ok(code);
    }
    function contentContinue(code) {
        effects.consume(code);
        effects.exit('chunkContent');
        previous = previous.next = effects.enter('chunkContent', {
            contentType: 'content',
            previous: previous
        });
        return data;
    }
}
function tokenizeContinuation(effects, ok, nok) {
    var self = this;
    return startLookahead;
    //TURBOPACK unreachable
    ;
    function startLookahead(code) {
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return factorySpace(effects, prefixed, 'linePrefix');
    }
    function prefixed(code) {
        if (code === null || markdownLineEnding(code)) {
            return nok(code);
        }
        if (self.parser.constructs.disable.null.indexOf('codeIndented') > -1 || prefixSize(self.events, 'linePrefix') < 4) {
            return effects.interrupt(self.parser.constructs.flow, nok, ok)(code);
        }
        return ok(code);
    }
}
module.exports = content;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/initialize/flow.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
var content = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/content.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var partialBlankLine = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/partial-blank-line.js [app-ssr] (ecmascript)");
var tokenize = initializeFlow;
function initializeFlow(effects) {
    var self = this;
    var initial = effects.attempt(// Try to parse a blank line.
    partialBlankLine, atBlankEnding, effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content, afterConstruct)), 'linePrefix')));
    return initial;
    //TURBOPACK unreachable
    ;
    function atBlankEnding(code) {
        if (code === null) {
            effects.consume(code);
            return;
        }
        effects.enter('lineEndingBlank');
        effects.consume(code);
        effects.exit('lineEndingBlank');
        self.currentConstruct = undefined;
        return initial;
    }
    function afterConstruct(code) {
        if (code === null) {
            effects.consume(code);
            return;
        }
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        self.currentConstruct = undefined;
        return initial;
    }
}
exports.tokenize = tokenize;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/initialize/text.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
var assign = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/assign.js [app-ssr] (ecmascript)");
var shallow = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/shallow.js [app-ssr] (ecmascript)");
var text = initializeFactory('text');
var string = initializeFactory('string');
var resolver = {
    resolveAll: createResolver()
};
function initializeFactory(field) {
    return {
        tokenize: initializeText,
        resolveAll: createResolver(field === 'text' ? resolveAllLineSuffixes : undefined)
    };
    //TURBOPACK unreachable
    ;
    function initializeText(effects) {
        var self = this;
        var constructs = this.parser.constructs[field];
        var text = effects.attempt(constructs, start, notText);
        return start;
        //TURBOPACK unreachable
        ;
        function start(code) {
            return atBreak(code) ? text(code) : notText(code);
        }
        function notText(code) {
            if (code === null) {
                effects.consume(code);
                return;
            }
            effects.enter('data');
            effects.consume(code);
            return data;
        }
        function data(code) {
            if (atBreak(code)) {
                effects.exit('data');
                return text(code);
            } // Data.
            effects.consume(code);
            return data;
        }
        function atBreak(code) {
            var list = constructs[code];
            var index = -1;
            if (code === null) {
                return true;
            }
            if (list) {
                while(++index < list.length){
                    if (!list[index].previous || list[index].previous.call(self, self.previous)) {
                        return true;
                    }
                }
            }
        }
    }
}
function createResolver(extraResolver) {
    return resolveAllText;
    //TURBOPACK unreachable
    ;
    function resolveAllText(events, context) {
        var index = -1;
        var enter // A rather boring computation (to merge adjacent `data` events) which
        ;
        // improves mm performance by 29%.
        while(++index <= events.length){
            if (enter === undefined) {
                if (events[index] && events[index][1].type === 'data') {
                    enter = index;
                    index++;
                }
            } else if (!events[index] || events[index][1].type !== 'data') {
                // Don’t do anything if there is one data token.
                if (index !== enter + 2) {
                    events[enter][1].end = events[index - 1][1].end;
                    events.splice(enter + 2, index - enter - 2);
                    index = enter + 2;
                }
                enter = undefined;
            }
        }
        return extraResolver ? extraResolver(events, context) : events;
    }
} // A rather ugly set of instructions which again looks at chunks in the input
// stream.
// The reason to do this here is that it is *much* faster to parse in reverse.
// And that we can’t hook into `null` to split the line suffix before an EOF.
// To do: figure out if we can make this into a clean utility, or even in core.
// As it will be useful for GFMs literal autolink extension (and maybe even
// tables?)
function resolveAllLineSuffixes(events, context) {
    var eventIndex = -1;
    var chunks;
    var data;
    var chunk;
    var index;
    var bufferIndex;
    var size;
    var tabs;
    var token;
    while(++eventIndex <= events.length){
        if ((eventIndex === events.length || events[eventIndex][1].type === 'lineEnding') && events[eventIndex - 1][1].type === 'data') {
            data = events[eventIndex - 1][1];
            chunks = context.sliceStream(data);
            index = chunks.length;
            bufferIndex = -1;
            size = 0;
            tabs = undefined;
            while(index--){
                chunk = chunks[index];
                if (typeof chunk === 'string') {
                    bufferIndex = chunk.length;
                    while(chunk.charCodeAt(bufferIndex - 1) === 32){
                        size++;
                        bufferIndex--;
                    }
                    if (bufferIndex) break;
                    bufferIndex = -1;
                } else if (chunk === -2) {
                    tabs = true;
                    size++;
                } else if (chunk === -1) ;
                else {
                    // Replacement character, exit.
                    index++;
                    break;
                }
            }
            if (size) {
                token = {
                    type: eventIndex === events.length || tabs || size < 2 ? 'lineSuffix' : 'hardBreakTrailing',
                    start: {
                        line: data.end.line,
                        column: data.end.column - size,
                        offset: data.end.offset - size,
                        _index: data.start._index + index,
                        _bufferIndex: index ? bufferIndex : data.start._bufferIndex + bufferIndex
                    },
                    end: shallow(data.end)
                };
                data.end = shallow(token.start);
                if (data.start.offset === data.end.offset) {
                    assign(data, token);
                } else {
                    events.splice(eventIndex, 0, [
                        'enter',
                        token,
                        context
                    ], [
                        'exit',
                        token,
                        context
                    ]);
                    eventIndex += 2;
                }
            }
            eventIndex++;
        }
    }
    return events;
}
exports.resolver = resolver;
exports.string = string;
exports.text = text;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/miniflat.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function miniflat(value) {
    return value === null || value === undefined ? [] : 'length' in value ? value : [
        value
    ];
}
module.exports = miniflat;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/combine-extensions.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var hasOwnProperty = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/has-own-property.js [app-ssr] (ecmascript)");
var chunkedSplice = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-splice.js [app-ssr] (ecmascript)");
var miniflat = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/miniflat.js [app-ssr] (ecmascript)");
function combineExtensions(extensions) {
    var all = {};
    var index = -1;
    while(++index < extensions.length){
        extension(all, extensions[index]);
    }
    return all;
}
function extension(all, extension) {
    var hook;
    var left;
    var right;
    var code;
    for(hook in extension){
        left = hasOwnProperty.call(all, hook) ? all[hook] : all[hook] = {};
        right = extension[hook];
        for(code in right){
            left[code] = constructs(miniflat(right[code]), hasOwnProperty.call(left, code) ? left[code] : []);
        }
    }
}
function constructs(list, existing) {
    var index = -1;
    var before = [];
    while(++index < list.length){
        ;
        (list[index].add === 'after' ? existing : before).push(list[index]);
    }
    chunkedSplice(existing, 0, 0, before);
    return existing;
}
module.exports = combineExtensions;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-push.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var chunkedSplice = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-splice.js [app-ssr] (ecmascript)");
function chunkedPush(list, items) {
    if (list.length) {
        chunkedSplice(list, list.length, 0, items);
        return list;
    }
    return items;
}
module.exports = chunkedPush;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/resolve-all.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function resolveAll(constructs, events, context) {
    var called = [];
    var index = -1;
    var resolve;
    while(++index < constructs.length){
        resolve = constructs[index].resolveAll;
        if (resolve && called.indexOf(resolve) < 0) {
            events = resolve(events, context);
            called.push(resolve);
        }
    }
    return events;
}
module.exports = resolveAll;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/serialize-chunks.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var fromCharCode = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/from-char-code.js [app-ssr] (ecmascript)");
function serializeChunks(chunks) {
    var index = -1;
    var result = [];
    var chunk;
    var value;
    var atTab;
    while(++index < chunks.length){
        chunk = chunks[index];
        if (typeof chunk === 'string') {
            value = chunk;
        } else if (chunk === -5) {
            value = '\r';
        } else if (chunk === -4) {
            value = '\n';
        } else if (chunk === -3) {
            value = '\r' + '\n';
        } else if (chunk === -2) {
            value = '\t';
        } else if (chunk === -1) {
            if (atTab) continue;
            value = ' ';
        } else {
            // Currently only replacement character.
            value = fromCharCode(chunk);
        }
        atTab = chunk === -2;
        result.push(value);
    }
    return result.join('');
}
module.exports = serializeChunks;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/slice-chunks.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function sliceChunks(chunks, token) {
    var startIndex = token.start._index;
    var startBufferIndex = token.start._bufferIndex;
    var endIndex = token.end._index;
    var endBufferIndex = token.end._bufferIndex;
    var view;
    if (startIndex === endIndex) {
        view = [
            chunks[startIndex].slice(startBufferIndex, endBufferIndex)
        ];
    } else {
        view = chunks.slice(startIndex, endIndex);
        if (startBufferIndex > -1) {
            view[0] = view[0].slice(startBufferIndex);
        }
        if (endBufferIndex > 0) {
            view.push(chunks[endIndex].slice(0, endBufferIndex));
        }
    }
    return view;
}
module.exports = sliceChunks;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/create-tokenizer.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var assign = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/assign.js [app-ssr] (ecmascript)");
var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var chunkedPush = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-push.js [app-ssr] (ecmascript)");
var chunkedSplice = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-splice.js [app-ssr] (ecmascript)");
var miniflat = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/miniflat.js [app-ssr] (ecmascript)");
var resolveAll = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/resolve-all.js [app-ssr] (ecmascript)");
var serializeChunks = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/serialize-chunks.js [app-ssr] (ecmascript)");
var shallow = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/shallow.js [app-ssr] (ecmascript)");
var sliceChunks = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/slice-chunks.js [app-ssr] (ecmascript)");
// Create a tokenizer.
// Tokenizers deal with one type of data (e.g., containers, flow, text).
// The parser is the object dealing with it all.
// `initialize` works like other constructs, except that only its `tokenize`
// function is used, in which case it doesn’t receive an `ok` or `nok`.
// `from` can be given to set the point before the first character, although
// when further lines are indented, they must be set with `defineSkip`.
function createTokenizer(parser, initialize, from) {
    var point = from ? shallow(from) : {
        line: 1,
        column: 1,
        offset: 0
    };
    var columnStart = {};
    var resolveAllConstructs = [];
    var chunks = [];
    var stack = [];
    var effects = {
        consume: consume,
        enter: enter,
        exit: exit,
        attempt: constructFactory(onsuccessfulconstruct),
        check: constructFactory(onsuccessfulcheck),
        interrupt: constructFactory(onsuccessfulcheck, {
            interrupt: true
        }),
        lazy: constructFactory(onsuccessfulcheck, {
            lazy: true
        })
    } // State and tools for resolving and serializing.
    ;
    var context = {
        previous: null,
        events: [],
        parser: parser,
        sliceStream: sliceStream,
        sliceSerialize: sliceSerialize,
        now: now,
        defineSkip: skip,
        write: write
    } // The state function.
    ;
    var state = initialize.tokenize.call(context, effects) // Track which character we expect to be consumed, to catch bugs.
    ;
    if (initialize.resolveAll) {
        resolveAllConstructs.push(initialize);
    } // Store where we are in the input stream.
    point._index = 0;
    point._bufferIndex = -1;
    return context;
    //TURBOPACK unreachable
    ;
    function write(slice) {
        chunks = chunkedPush(chunks, slice);
        main(); // Exit if we’re not done, resolve might change stuff.
        if (chunks[chunks.length - 1] !== null) {
            return [];
        }
        addResult(initialize, 0); // Otherwise, resolve, and exit.
        context.events = resolveAll(resolveAllConstructs, context.events, context);
        return context.events;
    } //
    // Tools.
    //
    function sliceSerialize(token) {
        return serializeChunks(sliceStream(token));
    }
    function sliceStream(token) {
        return sliceChunks(chunks, token);
    }
    function now() {
        return shallow(point);
    }
    function skip(value) {
        columnStart[value.line] = value.column;
        accountForPotentialSkip();
    } //
    // State management.
    //
    // Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
    // `consume`).
    // Here is where we walk through the chunks, which either include strings of
    // several characters, or numerical character codes.
    // The reason to do this in a loop instead of a call is so the stack can
    // drain.
    function main() {
        var chunkIndex;
        var chunk;
        while(point._index < chunks.length){
            chunk = chunks[point._index]; // If we’re in a buffer chunk, loop through it.
            if (typeof chunk === 'string') {
                chunkIndex = point._index;
                if (point._bufferIndex < 0) {
                    point._bufferIndex = 0;
                }
                while(point._index === chunkIndex && point._bufferIndex < chunk.length){
                    go(chunk.charCodeAt(point._bufferIndex));
                }
            } else {
                go(chunk);
            }
        }
    } // Deal with one code.
    function go(code) {
        state = state(code);
    } // Move a character forward.
    function consume(code) {
        if (markdownLineEnding(code)) {
            point.line++;
            point.column = 1;
            point.offset += code === -3 ? 2 : 1;
            accountForPotentialSkip();
        } else if (code !== -1) {
            point.column++;
            point.offset++;
        } // Not in a string chunk.
        if (point._bufferIndex < 0) {
            point._index++;
        } else {
            point._bufferIndex++; // At end of string chunk.
            if (point._bufferIndex === chunks[point._index].length) {
                point._bufferIndex = -1;
                point._index++;
            }
        } // Expose the previous character.
        context.previous = code; // Mark as consumed.
    } // Start a token.
    function enter(type, fields) {
        var token = fields || {};
        token.type = type;
        token.start = now();
        context.events.push([
            'enter',
            token,
            context
        ]);
        stack.push(token);
        return token;
    } // Stop a token.
    function exit(type) {
        var token = stack.pop();
        token.end = now();
        context.events.push([
            'exit',
            token,
            context
        ]);
        return token;
    } // Use results.
    function onsuccessfulconstruct(construct, info) {
        addResult(construct, info.from);
    } // Discard results.
    function onsuccessfulcheck(construct, info) {
        info.restore();
    } // Factory to attempt/check/interrupt.
    function constructFactory(onreturn, fields) {
        return hook // Handle either an object mapping codes to constructs, a list of
        ;
        //TURBOPACK unreachable
        ;
        // constructs, or a single construct.
        function hook(constructs, returnState, bogusState) {
            var listOfConstructs;
            var constructIndex;
            var currentConstruct;
            var info;
            return constructs.tokenize || 'length' in constructs ? handleListOfConstructs(miniflat(constructs)) : handleMapOfConstructs;
            //TURBOPACK unreachable
            ;
            function handleMapOfConstructs(code) {
                if (code in constructs || null in constructs) {
                    return handleListOfConstructs(constructs.null ? /* c8 ignore next */ miniflat(constructs[code]).concat(miniflat(constructs.null)) : constructs[code])(code);
                }
                return bogusState(code);
            }
            function handleListOfConstructs(list) {
                listOfConstructs = list;
                constructIndex = 0;
                return handleConstruct(list[constructIndex]);
            }
            function handleConstruct(construct) {
                return start;
                //TURBOPACK unreachable
                ;
                function start(code) {
                    // To do: not nede to store if there is no bogus state, probably?
                    // Currently doesn’t work because `inspect` in document does a check
                    // w/o a bogus, which doesn’t make sense. But it does seem to help perf
                    // by not storing.
                    info = store();
                    currentConstruct = construct;
                    if (!construct.partial) {
                        context.currentConstruct = construct;
                    }
                    if (construct.name && context.parser.constructs.disable.null.indexOf(construct.name) > -1) {
                        return nok();
                    }
                    return construct.tokenize.call(fields ? assign({}, context, fields) : context, effects, ok, nok)(code);
                }
            }
            function ok(code) {
                onreturn(currentConstruct, info);
                return returnState;
            }
            function nok(code) {
                info.restore();
                if (++constructIndex < listOfConstructs.length) {
                    return handleConstruct(listOfConstructs[constructIndex]);
                }
                return bogusState;
            }
        }
    }
    function addResult(construct, from) {
        if (construct.resolveAll && resolveAllConstructs.indexOf(construct) < 0) {
            resolveAllConstructs.push(construct);
        }
        if (construct.resolve) {
            chunkedSplice(context.events, from, context.events.length - from, construct.resolve(context.events.slice(from), context));
        }
        if (construct.resolveTo) {
            context.events = construct.resolveTo(context.events, context);
        }
    }
    function store() {
        var startPoint = now();
        var startPrevious = context.previous;
        var startCurrentConstruct = context.currentConstruct;
        var startEventsIndex = context.events.length;
        var startStack = Array.from(stack);
        return {
            restore: restore,
            from: startEventsIndex
        };
        //TURBOPACK unreachable
        ;
        function restore() {
            point = startPoint;
            context.previous = startPrevious;
            context.currentConstruct = startCurrentConstruct;
            context.events.length = startEventsIndex;
            stack = startStack;
            accountForPotentialSkip();
        }
    }
    function accountForPotentialSkip() {
        if (point.line in columnStart && point.column < 2) {
            point.column = columnStart[point.line];
            point.offset += columnStart[point.line] - 1;
        }
    }
}
module.exports = createTokenizer;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending-or-space.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function markdownLineEndingOrSpace(code) {
    return code < 0 || code === 32;
}
module.exports = markdownLineEndingOrSpace;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/constant/unicode-punctuation-regex.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This module is generated by `script/`.
//
// CommonMark handles attention (emphasis, strong) markers based on what comes
// before or after them.
// One such difference is if those characters are Unicode punctuation.
// This script is generated from the Unicode data.
var unicodePunctuation = /[!-\/:-@\[-`\{-~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;
module.exports = unicodePunctuation;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/regex-check.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var fromCharCode = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/from-char-code.js [app-ssr] (ecmascript)");
function regexCheck(regex) {
    return check;
    //TURBOPACK unreachable
    ;
    function check(code) {
        return regex.test(fromCharCode(code));
    }
}
module.exports = regexCheck;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/unicode-punctuation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var unicodePunctuationRegex = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/unicode-punctuation-regex.js [app-ssr] (ecmascript)");
var regexCheck = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/regex-check.js [app-ssr] (ecmascript)");
// In fact adds to the bundle size.
var unicodePunctuation = regexCheck(unicodePunctuationRegex);
module.exports = unicodePunctuation;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/unicode-whitespace.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var regexCheck = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/regex-check.js [app-ssr] (ecmascript)");
var unicodeWhitespace = regexCheck(/\s/);
module.exports = unicodeWhitespace;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/classify-character.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEndingOrSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending-or-space.js [app-ssr] (ecmascript)");
var unicodePunctuation = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/unicode-punctuation.js [app-ssr] (ecmascript)");
var unicodeWhitespace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/unicode-whitespace.js [app-ssr] (ecmascript)");
// Classify whether a character is unicode whitespace, unicode punctuation, or
// anything else.
// Used for attention (emphasis, strong), whose sequences can open or close
// based on the class of surrounding characters.
function classifyCharacter(code) {
    if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) {
        return 1;
    }
    if (unicodePunctuation(code)) {
        return 2;
    }
}
module.exports = classifyCharacter;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/util/move-point.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// chunks (replacement characters, tabs, or line endings).
function movePoint(point, offset) {
    point.column += offset;
    point.offset += offset;
    point._bufferIndex += offset;
    return point;
}
module.exports = movePoint;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/attention.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var chunkedPush = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-push.js [app-ssr] (ecmascript)");
var chunkedSplice = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-splice.js [app-ssr] (ecmascript)");
var classifyCharacter = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/classify-character.js [app-ssr] (ecmascript)");
var movePoint = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/move-point.js [app-ssr] (ecmascript)");
var resolveAll = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/resolve-all.js [app-ssr] (ecmascript)");
var shallow = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/shallow.js [app-ssr] (ecmascript)");
var attention = {
    name: 'attention',
    tokenize: tokenizeAttention,
    resolveAll: resolveAllAttention
};
function resolveAllAttention(events, context) {
    var index = -1;
    var open;
    var group;
    var text;
    var openingSequence;
    var closingSequence;
    var use;
    var nextEvents;
    var offset // Walk through all events.
    ;
    //
    // Note: performance of this is fine on an mb of normal markdown, but it’s
    // a bottleneck for malicious stuff.
    while(++index < events.length){
        // Find a token that can close.
        if (events[index][0] === 'enter' && events[index][1].type === 'attentionSequence' && events[index][1]._close) {
            open = index; // Now walk back to find an opener.
            while(open--){
                // Find a token that can open the closer.
                if (events[open][0] === 'exit' && events[open][1].type === 'attentionSequence' && events[open][1]._open && // If the markers are the same:
                context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index][1]).charCodeAt(0)) {
                    // If the opening can close or the closing can open,
                    // and the close size *is not* a multiple of three,
                    // but the sum of the opening and closing size *is* multiple of three,
                    // then don’t match.
                    if ((events[open][1]._close || events[index][1]._open) && (events[index][1].end.offset - events[index][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index][1].end.offset - events[index][1].start.offset) % 3)) {
                        continue;
                    } // Number of markers to use from the sequence.
                    use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index][1].end.offset - events[index][1].start.offset > 1 ? 2 : 1;
                    openingSequence = {
                        type: use > 1 ? 'strongSequence' : 'emphasisSequence',
                        start: movePoint(shallow(events[open][1].end), -use),
                        end: shallow(events[open][1].end)
                    };
                    closingSequence = {
                        type: use > 1 ? 'strongSequence' : 'emphasisSequence',
                        start: shallow(events[index][1].start),
                        end: movePoint(shallow(events[index][1].start), use)
                    };
                    text = {
                        type: use > 1 ? 'strongText' : 'emphasisText',
                        start: shallow(events[open][1].end),
                        end: shallow(events[index][1].start)
                    };
                    group = {
                        type: use > 1 ? 'strong' : 'emphasis',
                        start: shallow(openingSequence.start),
                        end: shallow(closingSequence.end)
                    };
                    events[open][1].end = shallow(openingSequence.start);
                    events[index][1].start = shallow(closingSequence.end);
                    nextEvents = []; // If there are more markers in the opening, add them before.
                    if (events[open][1].end.offset - events[open][1].start.offset) {
                        nextEvents = chunkedPush(nextEvents, [
                            [
                                'enter',
                                events[open][1],
                                context
                            ],
                            [
                                'exit',
                                events[open][1],
                                context
                            ]
                        ]);
                    } // Opening.
                    nextEvents = chunkedPush(nextEvents, [
                        [
                            'enter',
                            group,
                            context
                        ],
                        [
                            'enter',
                            openingSequence,
                            context
                        ],
                        [
                            'exit',
                            openingSequence,
                            context
                        ],
                        [
                            'enter',
                            text,
                            context
                        ]
                    ]); // Between.
                    nextEvents = chunkedPush(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index), context)); // Closing.
                    nextEvents = chunkedPush(nextEvents, [
                        [
                            'exit',
                            text,
                            context
                        ],
                        [
                            'enter',
                            closingSequence,
                            context
                        ],
                        [
                            'exit',
                            closingSequence,
                            context
                        ],
                        [
                            'exit',
                            group,
                            context
                        ]
                    ]); // If there are more markers in the closing, add them after.
                    if (events[index][1].end.offset - events[index][1].start.offset) {
                        offset = 2;
                        nextEvents = chunkedPush(nextEvents, [
                            [
                                'enter',
                                events[index][1],
                                context
                            ],
                            [
                                'exit',
                                events[index][1],
                                context
                            ]
                        ]);
                    } else {
                        offset = 0;
                    }
                    chunkedSplice(events, open - 1, index - open + 3, nextEvents);
                    index = open + nextEvents.length - offset - 2;
                    break;
                }
            }
        }
    } // Remove remaining sequences.
    index = -1;
    while(++index < events.length){
        if (events[index][1].type === 'attentionSequence') {
            events[index][1].type = 'data';
        }
    }
    return events;
}
function tokenizeAttention(effects, ok) {
    var before = classifyCharacter(this.previous);
    var marker;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('attentionSequence');
        marker = code;
        return sequence(code);
    }
    function sequence(code) {
        var token;
        var after;
        var open;
        var close;
        if (code === marker) {
            effects.consume(code);
            return sequence;
        }
        token = effects.exit('attentionSequence');
        after = classifyCharacter(code);
        open = !after || after === 2 && before;
        close = !before || before === 2 && after;
        token._open = marker === 42 ? open : open && (before || !close);
        token._close = marker === 42 ? close : close && (after || !open);
        return ok(code);
    }
}
module.exports = attention;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-alpha.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var regexCheck = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/regex-check.js [app-ssr] (ecmascript)");
var asciiAlpha = regexCheck(/[A-Za-z]/);
module.exports = asciiAlpha;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-alphanumeric.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var regexCheck = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/regex-check.js [app-ssr] (ecmascript)");
var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
module.exports = asciiAlphanumeric;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-atext.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var regexCheck = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/regex-check.js [app-ssr] (ecmascript)");
var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
module.exports = asciiAtext;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-control.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Note: EOF is seen as ASCII control here, because `null < 32 == true`.
function asciiControl(code) {
    return(// Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code < 32 || code === 127);
}
module.exports = asciiControl;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/autolink.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var asciiAlpha = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-alpha.js [app-ssr] (ecmascript)");
var asciiAlphanumeric = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-alphanumeric.js [app-ssr] (ecmascript)");
var asciiAtext = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-atext.js [app-ssr] (ecmascript)");
var asciiControl = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-control.js [app-ssr] (ecmascript)");
var autolink = {
    name: 'autolink',
    tokenize: tokenizeAutolink
};
function tokenizeAutolink(effects, ok, nok) {
    var size = 1;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('autolink');
        effects.enter('autolinkMarker');
        effects.consume(code);
        effects.exit('autolinkMarker');
        effects.enter('autolinkProtocol');
        return open;
    }
    function open(code) {
        if (asciiAlpha(code)) {
            effects.consume(code);
            return schemeOrEmailAtext;
        }
        return asciiAtext(code) ? emailAtext(code) : nok(code);
    }
    function schemeOrEmailAtext(code) {
        return code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code) ? schemeInsideOrEmailAtext(code) : emailAtext(code);
    }
    function schemeInsideOrEmailAtext(code) {
        if (code === 58) {
            effects.consume(code);
            return urlInside;
        }
        if ((code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) && size++ < 32) {
            effects.consume(code);
            return schemeInsideOrEmailAtext;
        }
        return emailAtext(code);
    }
    function urlInside(code) {
        if (code === 62) {
            effects.exit('autolinkProtocol');
            return end(code);
        }
        if (code === 32 || code === 60 || asciiControl(code)) {
            return nok(code);
        }
        effects.consume(code);
        return urlInside;
    }
    function emailAtext(code) {
        if (code === 64) {
            effects.consume(code);
            size = 0;
            return emailAtSignOrDot;
        }
        if (asciiAtext(code)) {
            effects.consume(code);
            return emailAtext;
        }
        return nok(code);
    }
    function emailAtSignOrDot(code) {
        return asciiAlphanumeric(code) ? emailLabel(code) : nok(code);
    }
    function emailLabel(code) {
        if (code === 46) {
            effects.consume(code);
            size = 0;
            return emailAtSignOrDot;
        }
        if (code === 62) {
            // Exit, then change the type.
            effects.exit('autolinkProtocol').type = 'autolinkEmail';
            return end(code);
        }
        return emailValue(code);
    }
    function emailValue(code) {
        if ((code === 45 || asciiAlphanumeric(code)) && size++ < 63) {
            effects.consume(code);
            return code === 45 ? emailValue : emailLabel;
        }
        return nok(code);
    }
    function end(code) {
        effects.enter('autolinkMarker');
        effects.consume(code);
        effects.exit('autolinkMarker');
        effects.exit('autolink');
        return ok;
    }
}
module.exports = autolink;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/block-quote.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-space.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var blockQuote = {
    name: 'blockQuote',
    tokenize: tokenizeBlockQuoteStart,
    continuation: {
        tokenize: tokenizeBlockQuoteContinuation
    },
    exit: exit
};
function tokenizeBlockQuoteStart(effects, ok, nok) {
    var self = this;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        if (code === 62) {
            if (!self.containerState.open) {
                effects.enter('blockQuote', {
                    _container: true
                });
                self.containerState.open = true;
            }
            effects.enter('blockQuotePrefix');
            effects.enter('blockQuoteMarker');
            effects.consume(code);
            effects.exit('blockQuoteMarker');
            return after;
        }
        return nok(code);
    }
    function after(code) {
        if (markdownSpace(code)) {
            effects.enter('blockQuotePrefixWhitespace');
            effects.consume(code);
            effects.exit('blockQuotePrefixWhitespace');
            effects.exit('blockQuotePrefix');
            return ok;
        }
        effects.exit('blockQuotePrefix');
        return ok(code);
    }
}
function tokenizeBlockQuoteContinuation(effects, ok, nok) {
    return factorySpace(effects, effects.attempt(blockQuote, ok, nok), 'linePrefix', this.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4);
}
function exit(effects) {
    effects.exit('blockQuote');
}
module.exports = blockQuote;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-punctuation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var regexCheck = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/regex-check.js [app-ssr] (ecmascript)");
var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
module.exports = asciiPunctuation;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/character-escape.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var asciiPunctuation = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-punctuation.js [app-ssr] (ecmascript)");
var characterEscape = {
    name: 'characterEscape',
    tokenize: tokenizeCharacterEscape
};
function tokenizeCharacterEscape(effects, ok, nok) {
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('characterEscape');
        effects.enter('escapeMarker');
        effects.consume(code);
        effects.exit('escapeMarker');
        return open;
    }
    function open(code) {
        if (asciiPunctuation(code)) {
            effects.enter('characterEscapeValue');
            effects.consume(code);
            effects.exit('characterEscapeValue');
            effects.exit('characterEscape');
            return ok;
        }
        return nok(code);
    }
}
module.exports = characterEscape;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-digit.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var regexCheck = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/regex-check.js [app-ssr] (ecmascript)");
var asciiDigit = regexCheck(/\d/);
module.exports = asciiDigit;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-hex-digit.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var regexCheck = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/regex-check.js [app-ssr] (ecmascript)");
var asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
module.exports = asciiHexDigit;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/character-reference.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var decodeEntity = __turbopack_context__.r("[project]/node_modules/parse-entities/decode-entity.js [app-ssr] (ecmascript)");
var asciiAlphanumeric = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-alphanumeric.js [app-ssr] (ecmascript)");
var asciiDigit = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-digit.js [app-ssr] (ecmascript)");
var asciiHexDigit = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-hex-digit.js [app-ssr] (ecmascript)");
function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : {
        default: e
    };
}
var decodeEntity__default = /*#__PURE__*/ _interopDefaultLegacy(decodeEntity);
var characterReference = {
    name: 'characterReference',
    tokenize: tokenizeCharacterReference
};
function tokenizeCharacterReference(effects, ok, nok) {
    var self = this;
    var size = 0;
    var max;
    var test;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('characterReference');
        effects.enter('characterReferenceMarker');
        effects.consume(code);
        effects.exit('characterReferenceMarker');
        return open;
    }
    function open(code) {
        if (code === 35) {
            effects.enter('characterReferenceMarkerNumeric');
            effects.consume(code);
            effects.exit('characterReferenceMarkerNumeric');
            return numeric;
        }
        effects.enter('characterReferenceValue');
        max = 31;
        test = asciiAlphanumeric;
        return value(code);
    }
    function numeric(code) {
        if (code === 88 || code === 120) {
            effects.enter('characterReferenceMarkerHexadecimal');
            effects.consume(code);
            effects.exit('characterReferenceMarkerHexadecimal');
            effects.enter('characterReferenceValue');
            max = 6;
            test = asciiHexDigit;
            return value;
        }
        effects.enter('characterReferenceValue');
        max = 7;
        test = asciiDigit;
        return value(code);
    }
    function value(code) {
        var token;
        if (code === 59 && size) {
            token = effects.exit('characterReferenceValue');
            if (test === asciiAlphanumeric && !decodeEntity__default['default'](self.sliceSerialize(token))) {
                return nok(code);
            }
            effects.enter('characterReferenceMarker');
            effects.consume(code);
            effects.exit('characterReferenceMarker');
            effects.exit('characterReference');
            return ok;
        }
        if (test(code) && size++ < max) {
            effects.consume(code);
            return value;
        }
        return nok(code);
    }
}
module.exports = characterReference;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/code-fenced.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var markdownLineEndingOrSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending-or-space.js [app-ssr] (ecmascript)");
var prefixSize = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/prefix-size.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var codeFenced = {
    name: 'codeFenced',
    tokenize: tokenizeCodeFenced,
    concrete: true
};
function tokenizeCodeFenced(effects, ok, nok) {
    var self = this;
    var closingFenceConstruct = {
        tokenize: tokenizeClosingFence,
        partial: true
    };
    var initialPrefix = prefixSize(this.events, 'linePrefix');
    var sizeOpen = 0;
    var marker;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('codeFenced');
        effects.enter('codeFencedFence');
        effects.enter('codeFencedFenceSequence');
        marker = code;
        return sequenceOpen(code);
    }
    function sequenceOpen(code) {
        if (code === marker) {
            effects.consume(code);
            sizeOpen++;
            return sequenceOpen;
        }
        effects.exit('codeFencedFenceSequence');
        return sizeOpen < 3 ? nok(code) : factorySpace(effects, infoOpen, 'whitespace')(code);
    }
    function infoOpen(code) {
        if (code === null || markdownLineEnding(code)) {
            return openAfter(code);
        }
        effects.enter('codeFencedFenceInfo');
        effects.enter('chunkString', {
            contentType: 'string'
        });
        return info(code);
    }
    function info(code) {
        if (code === null || markdownLineEndingOrSpace(code)) {
            effects.exit('chunkString');
            effects.exit('codeFencedFenceInfo');
            return factorySpace(effects, infoAfter, 'whitespace')(code);
        }
        if (code === 96 && code === marker) return nok(code);
        effects.consume(code);
        return info;
    }
    function infoAfter(code) {
        if (code === null || markdownLineEnding(code)) {
            return openAfter(code);
        }
        effects.enter('codeFencedFenceMeta');
        effects.enter('chunkString', {
            contentType: 'string'
        });
        return meta(code);
    }
    function meta(code) {
        if (code === null || markdownLineEnding(code)) {
            effects.exit('chunkString');
            effects.exit('codeFencedFenceMeta');
            return openAfter(code);
        }
        if (code === 96 && code === marker) return nok(code);
        effects.consume(code);
        return meta;
    }
    function openAfter(code) {
        effects.exit('codeFencedFence');
        return self.interrupt ? ok(code) : content(code);
    }
    function content(code) {
        if (code === null) {
            return after(code);
        }
        if (markdownLineEnding(code)) {
            effects.enter('lineEnding');
            effects.consume(code);
            effects.exit('lineEnding');
            return effects.attempt(closingFenceConstruct, after, initialPrefix ? factorySpace(effects, content, 'linePrefix', initialPrefix + 1) : content);
        }
        effects.enter('codeFlowValue');
        return contentContinue(code);
    }
    function contentContinue(code) {
        if (code === null || markdownLineEnding(code)) {
            effects.exit('codeFlowValue');
            return content(code);
        }
        effects.consume(code);
        return contentContinue;
    }
    function after(code) {
        effects.exit('codeFenced');
        return ok(code);
    }
    function tokenizeClosingFence(effects, ok, nok) {
        var size = 0;
        return factorySpace(effects, closingSequenceStart, 'linePrefix', this.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4);
        //TURBOPACK unreachable
        ;
        function closingSequenceStart(code) {
            effects.enter('codeFencedFence');
            effects.enter('codeFencedFenceSequence');
            return closingSequence(code);
        }
        function closingSequence(code) {
            if (code === marker) {
                effects.consume(code);
                size++;
                return closingSequence;
            }
            if (size < sizeOpen) return nok(code);
            effects.exit('codeFencedFenceSequence');
            return factorySpace(effects, closingSequenceEnd, 'whitespace')(code);
        }
        function closingSequenceEnd(code) {
            if (code === null || markdownLineEnding(code)) {
                effects.exit('codeFencedFence');
                return ok(code);
            }
            return nok(code);
        }
    }
}
module.exports = codeFenced;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/code-indented.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var chunkedSplice = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-splice.js [app-ssr] (ecmascript)");
var prefixSize = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/prefix-size.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var codeIndented = {
    name: 'codeIndented',
    tokenize: tokenizeCodeIndented,
    resolve: resolveCodeIndented
};
var indentedContentConstruct = {
    tokenize: tokenizeIndentedContent,
    partial: true
};
function resolveCodeIndented(events, context) {
    var code = {
        type: 'codeIndented',
        start: events[0][1].start,
        end: events[events.length - 1][1].end
    };
    chunkedSplice(events, 0, 0, [
        [
            'enter',
            code,
            context
        ]
    ]);
    chunkedSplice(events, events.length, 0, [
        [
            'exit',
            code,
            context
        ]
    ]);
    return events;
}
function tokenizeCodeIndented(effects, ok, nok) {
    return effects.attempt(indentedContentConstruct, afterPrefix, nok);
    //TURBOPACK unreachable
    ;
    function afterPrefix(code) {
        if (code === null) {
            return ok(code);
        }
        if (markdownLineEnding(code)) {
            return effects.attempt(indentedContentConstruct, afterPrefix, ok)(code);
        }
        effects.enter('codeFlowValue');
        return content(code);
    }
    function content(code) {
        if (code === null || markdownLineEnding(code)) {
            effects.exit('codeFlowValue');
            return afterPrefix(code);
        }
        effects.consume(code);
        return content;
    }
}
function tokenizeIndentedContent(effects, ok, nok) {
    var self = this;
    return factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1);
    //TURBOPACK unreachable
    ;
    function afterPrefix(code) {
        if (markdownLineEnding(code)) {
            effects.enter('lineEnding');
            effects.consume(code);
            effects.exit('lineEnding');
            return factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1);
        }
        return prefixSize(self.events, 'linePrefix') < 4 ? nok(code) : ok(code);
    }
}
module.exports = codeIndented;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/code-text.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var codeText = {
    name: 'codeText',
    tokenize: tokenizeCodeText,
    resolve: resolveCodeText,
    previous: previous
};
function resolveCodeText(events) {
    var tailExitIndex = events.length - 4;
    var headEnterIndex = 3;
    var index;
    var enter // If we start and end with an EOL or a space.
    ;
    if ((events[headEnterIndex][1].type === 'lineEnding' || events[headEnterIndex][1].type === 'space') && (events[tailExitIndex][1].type === 'lineEnding' || events[tailExitIndex][1].type === 'space')) {
        index = headEnterIndex; // And we have data.
        while(++index < tailExitIndex){
            if (events[index][1].type === 'codeTextData') {
                // Then we have padding.
                events[tailExitIndex][1].type = events[headEnterIndex][1].type = 'codeTextPadding';
                headEnterIndex += 2;
                tailExitIndex -= 2;
                break;
            }
        }
    } // Merge adjacent spaces and data.
    index = headEnterIndex - 1;
    tailExitIndex++;
    while(++index <= tailExitIndex){
        if (enter === undefined) {
            if (index !== tailExitIndex && events[index][1].type !== 'lineEnding') {
                enter = index;
            }
        } else if (index === tailExitIndex || events[index][1].type === 'lineEnding') {
            events[enter][1].type = 'codeTextData';
            if (index !== enter + 2) {
                events[enter][1].end = events[index - 1][1].end;
                events.splice(enter + 2, index - enter - 2);
                tailExitIndex -= index - enter - 2;
                index = enter + 2;
            }
            enter = undefined;
        }
    }
    return events;
}
function previous(code) {
    // If there is a previous code, there will always be a tail.
    return code !== 96 || this.events[this.events.length - 1][1].type === 'characterEscape';
}
function tokenizeCodeText(effects, ok, nok) {
    var sizeOpen = 0;
    var size;
    var token;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('codeText');
        effects.enter('codeTextSequence');
        return openingSequence(code);
    }
    function openingSequence(code) {
        if (code === 96) {
            effects.consume(code);
            sizeOpen++;
            return openingSequence;
        }
        effects.exit('codeTextSequence');
        return gap(code);
    }
    function gap(code) {
        // EOF.
        if (code === null) {
            return nok(code);
        } // Closing fence?
        // Could also be data.
        if (code === 96) {
            token = effects.enter('codeTextSequence');
            size = 0;
            return closingSequence(code);
        } // Tabs don’t work, and virtual spaces don’t make sense.
        if (code === 32) {
            effects.enter('space');
            effects.consume(code);
            effects.exit('space');
            return gap;
        }
        if (markdownLineEnding(code)) {
            effects.enter('lineEnding');
            effects.consume(code);
            effects.exit('lineEnding');
            return gap;
        } // Data.
        effects.enter('codeTextData');
        return data(code);
    } // In code.
    function data(code) {
        if (code === null || code === 32 || code === 96 || markdownLineEnding(code)) {
            effects.exit('codeTextData');
            return gap(code);
        }
        effects.consume(code);
        return data;
    } // Closing fence.
    function closingSequence(code) {
        // More.
        if (code === 96) {
            effects.consume(code);
            size++;
            return closingSequence;
        } // Done!
        if (size === sizeOpen) {
            effects.exit('codeTextSequence');
            effects.exit('codeText');
            return ok(code);
        } // More or less accents: mark as data.
        token.type = 'codeTextData';
        return data(code);
    }
}
module.exports = codeText;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-destination.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var asciiControl = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-control.js [app-ssr] (ecmascript)");
var markdownLineEndingOrSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending-or-space.js [app-ssr] (ecmascript)");
var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
// eslint-disable-next-line max-params
function destinationFactory(effects, ok, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
    var limit = max || Infinity;
    var balance = 0;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        if (code === 60) {
            effects.enter(type);
            effects.enter(literalType);
            effects.enter(literalMarkerType);
            effects.consume(code);
            effects.exit(literalMarkerType);
            return destinationEnclosedBefore;
        }
        if (asciiControl(code) || code === 41) {
            return nok(code);
        }
        effects.enter(type);
        effects.enter(rawType);
        effects.enter(stringType);
        effects.enter('chunkString', {
            contentType: 'string'
        });
        return destinationRaw(code);
    }
    function destinationEnclosedBefore(code) {
        if (code === 62) {
            effects.enter(literalMarkerType);
            effects.consume(code);
            effects.exit(literalMarkerType);
            effects.exit(literalType);
            effects.exit(type);
            return ok;
        }
        effects.enter(stringType);
        effects.enter('chunkString', {
            contentType: 'string'
        });
        return destinationEnclosed(code);
    }
    function destinationEnclosed(code) {
        if (code === 62) {
            effects.exit('chunkString');
            effects.exit(stringType);
            return destinationEnclosedBefore(code);
        }
        if (code === null || code === 60 || markdownLineEnding(code)) {
            return nok(code);
        }
        effects.consume(code);
        return code === 92 ? destinationEnclosedEscape : destinationEnclosed;
    }
    function destinationEnclosedEscape(code) {
        if (code === 60 || code === 62 || code === 92) {
            effects.consume(code);
            return destinationEnclosed;
        }
        return destinationEnclosed(code);
    }
    function destinationRaw(code) {
        if (code === 40) {
            if (++balance > limit) return nok(code);
            effects.consume(code);
            return destinationRaw;
        }
        if (code === 41) {
            if (!balance--) {
                effects.exit('chunkString');
                effects.exit(stringType);
                effects.exit(rawType);
                effects.exit(type);
                return ok(code);
            }
            effects.consume(code);
            return destinationRaw;
        }
        if (code === null || markdownLineEndingOrSpace(code)) {
            if (balance) return nok(code);
            effects.exit('chunkString');
            effects.exit(stringType);
            effects.exit(rawType);
            effects.exit(type);
            return ok(code);
        }
        if (asciiControl(code)) return nok(code);
        effects.consume(code);
        return code === 92 ? destinationRawEscape : destinationRaw;
    }
    function destinationRawEscape(code) {
        if (code === 40 || code === 41 || code === 92) {
            effects.consume(code);
            return destinationRaw;
        }
        return destinationRaw(code);
    }
}
module.exports = destinationFactory;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-label.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var markdownSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-space.js [app-ssr] (ecmascript)");
// eslint-disable-next-line max-params
function labelFactory(effects, ok, nok, type, markerType, stringType) {
    var self = this;
    var size = 0;
    var data;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter(type);
        effects.enter(markerType);
        effects.consume(code);
        effects.exit(markerType);
        effects.enter(stringType);
        return atBreak;
    }
    function atBreak(code) {
        if (code === null || code === 91 || code === 93 && !data || code === 94 && /* c8 ignore next */ !size && /* c8 ignore next */ '_hiddenFootnoteSupport' in self.parser.constructs || size > 999) {
            return nok(code);
        }
        if (code === 93) {
            effects.exit(stringType);
            effects.enter(markerType);
            effects.consume(code);
            effects.exit(markerType);
            effects.exit(type);
            return ok;
        }
        if (markdownLineEnding(code)) {
            effects.enter('lineEnding');
            effects.consume(code);
            effects.exit('lineEnding');
            return atBreak;
        }
        effects.enter('chunkString', {
            contentType: 'string'
        });
        return label(code);
    }
    function label(code) {
        if (code === null || code === 91 || code === 93 || markdownLineEnding(code) || size++ > 999) {
            effects.exit('chunkString');
            return atBreak(code);
        }
        effects.consume(code);
        data = data || !markdownSpace(code);
        return code === 92 ? labelEscape : label;
    }
    function labelEscape(code) {
        if (code === 91 || code === 92 || code === 93) {
            effects.consume(code);
            size++;
            return label;
        }
        return label(code);
    }
}
module.exports = labelFactory;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-whitespace.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var markdownSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-space.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
function whitespaceFactory(effects, ok) {
    var seen;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        if (markdownLineEnding(code)) {
            effects.enter('lineEnding');
            effects.consume(code);
            effects.exit('lineEnding');
            seen = true;
            return start;
        }
        if (markdownSpace(code)) {
            return factorySpace(effects, start, seen ? 'linePrefix' : 'lineSuffix')(code);
        }
        return ok(code);
    }
}
module.exports = whitespaceFactory;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-title.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
function titleFactory(effects, ok, nok, type, markerType, stringType) {
    var marker;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter(type);
        effects.enter(markerType);
        effects.consume(code);
        effects.exit(markerType);
        marker = code === 40 ? 41 : code;
        return atFirstTitleBreak;
    }
    function atFirstTitleBreak(code) {
        if (code === marker) {
            effects.enter(markerType);
            effects.consume(code);
            effects.exit(markerType);
            effects.exit(type);
            return ok;
        }
        effects.enter(stringType);
        return atTitleBreak(code);
    }
    function atTitleBreak(code) {
        if (code === marker) {
            effects.exit(stringType);
            return atFirstTitleBreak(marker);
        }
        if (code === null) {
            return nok(code);
        } // Note: blank lines can’t exist in content.
        if (markdownLineEnding(code)) {
            effects.enter('lineEnding');
            effects.consume(code);
            effects.exit('lineEnding');
            return factorySpace(effects, atTitleBreak, 'linePrefix');
        }
        effects.enter('chunkString', {
            contentType: 'string'
        });
        return title(code);
    }
    function title(code) {
        if (code === marker || code === null || markdownLineEnding(code)) {
            effects.exit('chunkString');
            return atTitleBreak(code);
        }
        effects.consume(code);
        return code === 92 ? titleEscape : title;
    }
    function titleEscape(code) {
        if (code === marker || code === 92) {
            effects.consume(code);
            return title;
        }
        return title(code);
    }
}
module.exports = titleFactory;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/definition.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var markdownLineEndingOrSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending-or-space.js [app-ssr] (ecmascript)");
var normalizeIdentifier = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/normalize-identifier.js [app-ssr] (ecmascript)");
var factoryDestination = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-destination.js [app-ssr] (ecmascript)");
var factoryLabel = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-label.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var factoryWhitespace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-whitespace.js [app-ssr] (ecmascript)");
var factoryTitle = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-title.js [app-ssr] (ecmascript)");
var definition = {
    name: 'definition',
    tokenize: tokenizeDefinition
};
var titleConstruct = {
    tokenize: tokenizeTitle,
    partial: true
};
function tokenizeDefinition(effects, ok, nok) {
    var self = this;
    var identifier;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('definition');
        return factoryLabel.call(self, effects, labelAfter, nok, 'definitionLabel', 'definitionLabelMarker', 'definitionLabelString')(code);
    }
    function labelAfter(code) {
        identifier = normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1));
        if (code === 58) {
            effects.enter('definitionMarker');
            effects.consume(code);
            effects.exit('definitionMarker'); // Note: blank lines can’t exist in content.
            return factoryWhitespace(effects, factoryDestination(effects, effects.attempt(titleConstruct, factorySpace(effects, after, 'whitespace'), factorySpace(effects, after, 'whitespace')), nok, 'definitionDestination', 'definitionDestinationLiteral', 'definitionDestinationLiteralMarker', 'definitionDestinationRaw', 'definitionDestinationString'));
        }
        return nok(code);
    }
    function after(code) {
        if (code === null || markdownLineEnding(code)) {
            effects.exit('definition');
            if (self.parser.defined.indexOf(identifier) < 0) {
                self.parser.defined.push(identifier);
            }
            return ok(code);
        }
        return nok(code);
    }
}
function tokenizeTitle(effects, ok, nok) {
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, before)(code) : nok(code);
    }
    function before(code) {
        if (code === 34 || code === 39 || code === 40) {
            return factoryTitle(effects, factorySpace(effects, after, 'whitespace'), nok, 'definitionTitle', 'definitionTitleMarker', 'definitionTitleString')(code);
        }
        return nok(code);
    }
    function after(code) {
        return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
    }
}
module.exports = definition;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/hard-break-escape.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var hardBreakEscape = {
    name: 'hardBreakEscape',
    tokenize: tokenizeHardBreakEscape
};
function tokenizeHardBreakEscape(effects, ok, nok) {
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('hardBreakEscape');
        effects.enter('escapeMarker');
        effects.consume(code);
        return open;
    }
    function open(code) {
        if (markdownLineEnding(code)) {
            effects.exit('escapeMarker');
            effects.exit('hardBreakEscape');
            return ok(code);
        }
        return nok(code);
    }
}
module.exports = hardBreakEscape;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/heading-atx.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var markdownLineEndingOrSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending-or-space.js [app-ssr] (ecmascript)");
var markdownSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-space.js [app-ssr] (ecmascript)");
var chunkedSplice = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-splice.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var headingAtx = {
    name: 'headingAtx',
    tokenize: tokenizeHeadingAtx,
    resolve: resolveHeadingAtx
};
function resolveHeadingAtx(events, context) {
    var contentEnd = events.length - 2;
    var contentStart = 3;
    var content;
    var text // Prefix whitespace, part of the opening.
    ;
    if (events[contentStart][1].type === 'whitespace') {
        contentStart += 2;
    } // Suffix whitespace, part of the closing.
    if (contentEnd - 2 > contentStart && events[contentEnd][1].type === 'whitespace') {
        contentEnd -= 2;
    }
    if (events[contentEnd][1].type === 'atxHeadingSequence' && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === 'whitespace')) {
        contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
    }
    if (contentEnd > contentStart) {
        content = {
            type: 'atxHeadingText',
            start: events[contentStart][1].start,
            end: events[contentEnd][1].end
        };
        text = {
            type: 'chunkText',
            start: events[contentStart][1].start,
            end: events[contentEnd][1].end,
            contentType: 'text'
        };
        chunkedSplice(events, contentStart, contentEnd - contentStart + 1, [
            [
                'enter',
                content,
                context
            ],
            [
                'enter',
                text,
                context
            ],
            [
                'exit',
                text,
                context
            ],
            [
                'exit',
                content,
                context
            ]
        ]);
    }
    return events;
}
function tokenizeHeadingAtx(effects, ok, nok) {
    var self = this;
    var size = 0;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('atxHeading');
        effects.enter('atxHeadingSequence');
        return fenceOpenInside(code);
    }
    function fenceOpenInside(code) {
        if (code === 35 && size++ < 6) {
            effects.consume(code);
            return fenceOpenInside;
        }
        if (code === null || markdownLineEndingOrSpace(code)) {
            effects.exit('atxHeadingSequence');
            return self.interrupt ? ok(code) : headingBreak(code);
        }
        return nok(code);
    }
    function headingBreak(code) {
        if (code === 35) {
            effects.enter('atxHeadingSequence');
            return sequence(code);
        }
        if (code === null || markdownLineEnding(code)) {
            effects.exit('atxHeading');
            return ok(code);
        }
        if (markdownSpace(code)) {
            return factorySpace(effects, headingBreak, 'whitespace')(code);
        }
        effects.enter('atxHeadingText');
        return data(code);
    }
    function sequence(code) {
        if (code === 35) {
            effects.consume(code);
            return sequence;
        }
        effects.exit('atxHeadingSequence');
        return headingBreak(code);
    }
    function data(code) {
        if (code === null || code === 35 || markdownLineEndingOrSpace(code)) {
            effects.exit('atxHeadingText');
            return headingBreak(code);
        }
        effects.consume(code);
        return data;
    }
}
module.exports = headingAtx;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/constant/html-block-names.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This module is copied from <https://spec.commonmark.org/0.29/#html-blocks>.
var basics = [
    'address',
    'article',
    'aside',
    'base',
    'basefont',
    'blockquote',
    'body',
    'caption',
    'center',
    'col',
    'colgroup',
    'dd',
    'details',
    'dialog',
    'dir',
    'div',
    'dl',
    'dt',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'frame',
    'frameset',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hr',
    'html',
    'iframe',
    'legend',
    'li',
    'link',
    'main',
    'menu',
    'menuitem',
    'nav',
    'noframes',
    'ol',
    'optgroup',
    'option',
    'p',
    'param',
    'section',
    'source',
    'summary',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'title',
    'tr',
    'track',
    'ul'
];
module.exports = basics;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/constant/html-raw-names.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This module is copied from <https://spec.commonmark.org/0.29/#html-blocks>.
var raws = [
    'pre',
    'script',
    'style',
    'textarea'
];
module.exports = raws;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/html-flow.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var asciiAlpha = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-alpha.js [app-ssr] (ecmascript)");
var asciiAlphanumeric = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-alphanumeric.js [app-ssr] (ecmascript)");
var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var markdownLineEndingOrSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending-or-space.js [app-ssr] (ecmascript)");
var markdownSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-space.js [app-ssr] (ecmascript)");
var fromCharCode = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/from-char-code.js [app-ssr] (ecmascript)");
var htmlBlockNames = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/html-block-names.js [app-ssr] (ecmascript)");
var htmlRawNames = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constant/html-raw-names.js [app-ssr] (ecmascript)");
var partialBlankLine = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/partial-blank-line.js [app-ssr] (ecmascript)");
var htmlFlow = {
    name: 'htmlFlow',
    tokenize: tokenizeHtmlFlow,
    resolveTo: resolveToHtmlFlow,
    concrete: true
};
var nextBlankConstruct = {
    tokenize: tokenizeNextBlank,
    partial: true
};
function resolveToHtmlFlow(events) {
    var index = events.length;
    while(index--){
        if (events[index][0] === 'enter' && events[index][1].type === 'htmlFlow') {
            break;
        }
    }
    if (index > 1 && events[index - 2][1].type === 'linePrefix') {
        // Add the prefix start to the HTML token.
        events[index][1].start = events[index - 2][1].start; // Add the prefix start to the HTML line token.
        events[index + 1][1].start = events[index - 2][1].start; // Remove the line prefix.
        events.splice(index - 2, 2);
    }
    return events;
}
function tokenizeHtmlFlow(effects, ok, nok) {
    var self = this;
    var kind;
    var startTag;
    var buffer;
    var index;
    var marker;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('htmlFlow');
        effects.enter('htmlFlowData');
        effects.consume(code);
        return open;
    }
    function open(code) {
        if (code === 33) {
            effects.consume(code);
            return declarationStart;
        }
        if (code === 47) {
            effects.consume(code);
            return tagCloseStart;
        }
        if (code === 63) {
            effects.consume(code);
            kind = 3; // While we’re in an instruction instead of a declaration, we’re on a `?`
            // right now, so we do need to search for `>`, similar to declarations.
            return self.interrupt ? ok : continuationDeclarationInside;
        }
        if (asciiAlpha(code)) {
            effects.consume(code);
            buffer = fromCharCode(code);
            startTag = true;
            return tagName;
        }
        return nok(code);
    }
    function declarationStart(code) {
        if (code === 45) {
            effects.consume(code);
            kind = 2;
            return commentOpenInside;
        }
        if (code === 91) {
            effects.consume(code);
            kind = 5;
            buffer = 'CDATA[';
            index = 0;
            return cdataOpenInside;
        }
        if (asciiAlpha(code)) {
            effects.consume(code);
            kind = 4;
            return self.interrupt ? ok : continuationDeclarationInside;
        }
        return nok(code);
    }
    function commentOpenInside(code) {
        if (code === 45) {
            effects.consume(code);
            return self.interrupt ? ok : continuationDeclarationInside;
        }
        return nok(code);
    }
    function cdataOpenInside(code) {
        if (code === buffer.charCodeAt(index++)) {
            effects.consume(code);
            return index === buffer.length ? self.interrupt ? ok : continuation : cdataOpenInside;
        }
        return nok(code);
    }
    function tagCloseStart(code) {
        if (asciiAlpha(code)) {
            effects.consume(code);
            buffer = fromCharCode(code);
            return tagName;
        }
        return nok(code);
    }
    function tagName(code) {
        if (code === null || code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
            if (code !== 47 && startTag && htmlRawNames.indexOf(buffer.toLowerCase()) > -1) {
                kind = 1;
                return self.interrupt ? ok(code) : continuation(code);
            }
            if (htmlBlockNames.indexOf(buffer.toLowerCase()) > -1) {
                kind = 6;
                if (code === 47) {
                    effects.consume(code);
                    return basicSelfClosing;
                }
                return self.interrupt ? ok(code) : continuation(code);
            }
            kind = 7; // Do not support complete HTML when interrupting.
            return self.interrupt ? nok(code) : startTag ? completeAttributeNameBefore(code) : completeClosingTagAfter(code);
        }
        if (code === 45 || asciiAlphanumeric(code)) {
            effects.consume(code);
            buffer += fromCharCode(code);
            return tagName;
        }
        return nok(code);
    }
    function basicSelfClosing(code) {
        if (code === 62) {
            effects.consume(code);
            return self.interrupt ? ok : continuation;
        }
        return nok(code);
    }
    function completeClosingTagAfter(code) {
        if (markdownSpace(code)) {
            effects.consume(code);
            return completeClosingTagAfter;
        }
        return completeEnd(code);
    }
    function completeAttributeNameBefore(code) {
        if (code === 47) {
            effects.consume(code);
            return completeEnd;
        }
        if (code === 58 || code === 95 || asciiAlpha(code)) {
            effects.consume(code);
            return completeAttributeName;
        }
        if (markdownSpace(code)) {
            effects.consume(code);
            return completeAttributeNameBefore;
        }
        return completeEnd(code);
    }
    function completeAttributeName(code) {
        if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
            effects.consume(code);
            return completeAttributeName;
        }
        return completeAttributeNameAfter(code);
    }
    function completeAttributeNameAfter(code) {
        if (code === 61) {
            effects.consume(code);
            return completeAttributeValueBefore;
        }
        if (markdownSpace(code)) {
            effects.consume(code);
            return completeAttributeNameAfter;
        }
        return completeAttributeNameBefore(code);
    }
    function completeAttributeValueBefore(code) {
        if (code === null || code === 60 || code === 61 || code === 62 || code === 96) {
            return nok(code);
        }
        if (code === 34 || code === 39) {
            effects.consume(code);
            marker = code;
            return completeAttributeValueQuoted;
        }
        if (markdownSpace(code)) {
            effects.consume(code);
            return completeAttributeValueBefore;
        }
        marker = undefined;
        return completeAttributeValueUnquoted(code);
    }
    function completeAttributeValueQuoted(code) {
        if (code === marker) {
            effects.consume(code);
            return completeAttributeValueQuotedAfter;
        }
        if (code === null || markdownLineEnding(code)) {
            return nok(code);
        }
        effects.consume(code);
        return completeAttributeValueQuoted;
    }
    function completeAttributeValueUnquoted(code) {
        if (code === null || code === 34 || code === 39 || code === 60 || code === 61 || code === 62 || code === 96 || markdownLineEndingOrSpace(code)) {
            return completeAttributeNameAfter(code);
        }
        effects.consume(code);
        return completeAttributeValueUnquoted;
    }
    function completeAttributeValueQuotedAfter(code) {
        if (code === 47 || code === 62 || markdownSpace(code)) {
            return completeAttributeNameBefore(code);
        }
        return nok(code);
    }
    function completeEnd(code) {
        if (code === 62) {
            effects.consume(code);
            return completeAfter;
        }
        return nok(code);
    }
    function completeAfter(code) {
        if (markdownSpace(code)) {
            effects.consume(code);
            return completeAfter;
        }
        return code === null || markdownLineEnding(code) ? continuation(code) : nok(code);
    }
    function continuation(code) {
        if (code === 45 && kind === 2) {
            effects.consume(code);
            return continuationCommentInside;
        }
        if (code === 60 && kind === 1) {
            effects.consume(code);
            return continuationRawTagOpen;
        }
        if (code === 62 && kind === 4) {
            effects.consume(code);
            return continuationClose;
        }
        if (code === 63 && kind === 3) {
            effects.consume(code);
            return continuationDeclarationInside;
        }
        if (code === 93 && kind === 5) {
            effects.consume(code);
            return continuationCharacterDataInside;
        }
        if (markdownLineEnding(code) && (kind === 6 || kind === 7)) {
            return effects.check(nextBlankConstruct, continuationClose, continuationAtLineEnding)(code);
        }
        if (code === null || markdownLineEnding(code)) {
            return continuationAtLineEnding(code);
        }
        effects.consume(code);
        return continuation;
    }
    function continuationAtLineEnding(code) {
        effects.exit('htmlFlowData');
        return htmlContinueStart(code);
    }
    function htmlContinueStart(code) {
        if (code === null) {
            return done(code);
        }
        if (markdownLineEnding(code)) {
            effects.enter('lineEnding');
            effects.consume(code);
            effects.exit('lineEnding');
            return htmlContinueStart;
        }
        effects.enter('htmlFlowData');
        return continuation(code);
    }
    function continuationCommentInside(code) {
        if (code === 45) {
            effects.consume(code);
            return continuationDeclarationInside;
        }
        return continuation(code);
    }
    function continuationRawTagOpen(code) {
        if (code === 47) {
            effects.consume(code);
            buffer = '';
            return continuationRawEndTag;
        }
        return continuation(code);
    }
    function continuationRawEndTag(code) {
        if (code === 62 && htmlRawNames.indexOf(buffer.toLowerCase()) > -1) {
            effects.consume(code);
            return continuationClose;
        }
        if (asciiAlpha(code) && buffer.length < 8) {
            effects.consume(code);
            buffer += fromCharCode(code);
            return continuationRawEndTag;
        }
        return continuation(code);
    }
    function continuationCharacterDataInside(code) {
        if (code === 93) {
            effects.consume(code);
            return continuationDeclarationInside;
        }
        return continuation(code);
    }
    function continuationDeclarationInside(code) {
        if (code === 62) {
            effects.consume(code);
            return continuationClose;
        }
        return continuation(code);
    }
    function continuationClose(code) {
        if (code === null || markdownLineEnding(code)) {
            effects.exit('htmlFlowData');
            return done(code);
        }
        effects.consume(code);
        return continuationClose;
    }
    function done(code) {
        effects.exit('htmlFlow');
        return ok(code);
    }
}
function tokenizeNextBlank(effects, ok, nok) {
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.exit('htmlFlowData');
        effects.enter('lineEndingBlank');
        effects.consume(code);
        effects.exit('lineEndingBlank');
        return effects.attempt(partialBlankLine, ok, nok);
    }
}
module.exports = htmlFlow;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/html-text.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var asciiAlpha = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-alpha.js [app-ssr] (ecmascript)");
var asciiAlphanumeric = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-alphanumeric.js [app-ssr] (ecmascript)");
var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var markdownLineEndingOrSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending-or-space.js [app-ssr] (ecmascript)");
var markdownSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-space.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var htmlText = {
    name: 'htmlText',
    tokenize: tokenizeHtmlText
};
function tokenizeHtmlText(effects, ok, nok) {
    var self = this;
    var marker;
    var buffer;
    var index;
    var returnState;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('htmlText');
        effects.enter('htmlTextData');
        effects.consume(code);
        return open;
    }
    function open(code) {
        if (code === 33) {
            effects.consume(code);
            return declarationOpen;
        }
        if (code === 47) {
            effects.consume(code);
            return tagCloseStart;
        }
        if (code === 63) {
            effects.consume(code);
            return instruction;
        }
        if (asciiAlpha(code)) {
            effects.consume(code);
            return tagOpen;
        }
        return nok(code);
    }
    function declarationOpen(code) {
        if (code === 45) {
            effects.consume(code);
            return commentOpen;
        }
        if (code === 91) {
            effects.consume(code);
            buffer = 'CDATA[';
            index = 0;
            return cdataOpen;
        }
        if (asciiAlpha(code)) {
            effects.consume(code);
            return declaration;
        }
        return nok(code);
    }
    function commentOpen(code) {
        if (code === 45) {
            effects.consume(code);
            return commentStart;
        }
        return nok(code);
    }
    function commentStart(code) {
        if (code === null || code === 62) {
            return nok(code);
        }
        if (code === 45) {
            effects.consume(code);
            return commentStartDash;
        }
        return comment(code);
    }
    function commentStartDash(code) {
        if (code === null || code === 62) {
            return nok(code);
        }
        return comment(code);
    }
    function comment(code) {
        if (code === null) {
            return nok(code);
        }
        if (code === 45) {
            effects.consume(code);
            return commentClose;
        }
        if (markdownLineEnding(code)) {
            returnState = comment;
            return atLineEnding(code);
        }
        effects.consume(code);
        return comment;
    }
    function commentClose(code) {
        if (code === 45) {
            effects.consume(code);
            return end;
        }
        return comment(code);
    }
    function cdataOpen(code) {
        if (code === buffer.charCodeAt(index++)) {
            effects.consume(code);
            return index === buffer.length ? cdata : cdataOpen;
        }
        return nok(code);
    }
    function cdata(code) {
        if (code === null) {
            return nok(code);
        }
        if (code === 93) {
            effects.consume(code);
            return cdataClose;
        }
        if (markdownLineEnding(code)) {
            returnState = cdata;
            return atLineEnding(code);
        }
        effects.consume(code);
        return cdata;
    }
    function cdataClose(code) {
        if (code === 93) {
            effects.consume(code);
            return cdataEnd;
        }
        return cdata(code);
    }
    function cdataEnd(code) {
        if (code === 62) {
            return end(code);
        }
        if (code === 93) {
            effects.consume(code);
            return cdataEnd;
        }
        return cdata(code);
    }
    function declaration(code) {
        if (code === null || code === 62) {
            return end(code);
        }
        if (markdownLineEnding(code)) {
            returnState = declaration;
            return atLineEnding(code);
        }
        effects.consume(code);
        return declaration;
    }
    function instruction(code) {
        if (code === null) {
            return nok(code);
        }
        if (code === 63) {
            effects.consume(code);
            return instructionClose;
        }
        if (markdownLineEnding(code)) {
            returnState = instruction;
            return atLineEnding(code);
        }
        effects.consume(code);
        return instruction;
    }
    function instructionClose(code) {
        return code === 62 ? end(code) : instruction(code);
    }
    function tagCloseStart(code) {
        if (asciiAlpha(code)) {
            effects.consume(code);
            return tagClose;
        }
        return nok(code);
    }
    function tagClose(code) {
        if (code === 45 || asciiAlphanumeric(code)) {
            effects.consume(code);
            return tagClose;
        }
        return tagCloseBetween(code);
    }
    function tagCloseBetween(code) {
        if (markdownLineEnding(code)) {
            returnState = tagCloseBetween;
            return atLineEnding(code);
        }
        if (markdownSpace(code)) {
            effects.consume(code);
            return tagCloseBetween;
        }
        return end(code);
    }
    function tagOpen(code) {
        if (code === 45 || asciiAlphanumeric(code)) {
            effects.consume(code);
            return tagOpen;
        }
        if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
            return tagOpenBetween(code);
        }
        return nok(code);
    }
    function tagOpenBetween(code) {
        if (code === 47) {
            effects.consume(code);
            return end;
        }
        if (code === 58 || code === 95 || asciiAlpha(code)) {
            effects.consume(code);
            return tagOpenAttributeName;
        }
        if (markdownLineEnding(code)) {
            returnState = tagOpenBetween;
            return atLineEnding(code);
        }
        if (markdownSpace(code)) {
            effects.consume(code);
            return tagOpenBetween;
        }
        return end(code);
    }
    function tagOpenAttributeName(code) {
        if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
            effects.consume(code);
            return tagOpenAttributeName;
        }
        return tagOpenAttributeNameAfter(code);
    }
    function tagOpenAttributeNameAfter(code) {
        if (code === 61) {
            effects.consume(code);
            return tagOpenAttributeValueBefore;
        }
        if (markdownLineEnding(code)) {
            returnState = tagOpenAttributeNameAfter;
            return atLineEnding(code);
        }
        if (markdownSpace(code)) {
            effects.consume(code);
            return tagOpenAttributeNameAfter;
        }
        return tagOpenBetween(code);
    }
    function tagOpenAttributeValueBefore(code) {
        if (code === null || code === 60 || code === 61 || code === 62 || code === 96) {
            return nok(code);
        }
        if (code === 34 || code === 39) {
            effects.consume(code);
            marker = code;
            return tagOpenAttributeValueQuoted;
        }
        if (markdownLineEnding(code)) {
            returnState = tagOpenAttributeValueBefore;
            return atLineEnding(code);
        }
        if (markdownSpace(code)) {
            effects.consume(code);
            return tagOpenAttributeValueBefore;
        }
        effects.consume(code);
        marker = undefined;
        return tagOpenAttributeValueUnquoted;
    }
    function tagOpenAttributeValueQuoted(code) {
        if (code === marker) {
            effects.consume(code);
            return tagOpenAttributeValueQuotedAfter;
        }
        if (code === null) {
            return nok(code);
        }
        if (markdownLineEnding(code)) {
            returnState = tagOpenAttributeValueQuoted;
            return atLineEnding(code);
        }
        effects.consume(code);
        return tagOpenAttributeValueQuoted;
    }
    function tagOpenAttributeValueQuotedAfter(code) {
        if (code === 62 || code === 47 || markdownLineEndingOrSpace(code)) {
            return tagOpenBetween(code);
        }
        return nok(code);
    }
    function tagOpenAttributeValueUnquoted(code) {
        if (code === null || code === 34 || code === 39 || code === 60 || code === 61 || code === 96) {
            return nok(code);
        }
        if (code === 62 || markdownLineEndingOrSpace(code)) {
            return tagOpenBetween(code);
        }
        effects.consume(code);
        return tagOpenAttributeValueUnquoted;
    } // We can’t have blank lines in content, so no need to worry about empty
    // tokens.
    function atLineEnding(code) {
        effects.exit('htmlTextData');
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return factorySpace(effects, afterPrefix, 'linePrefix', self.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4);
    }
    function afterPrefix(code) {
        effects.enter('htmlTextData');
        return returnState(code);
    }
    function end(code) {
        if (code === 62) {
            effects.consume(code);
            effects.exit('htmlTextData');
            effects.exit('htmlText');
            return ok;
        }
        return nok(code);
    }
}
module.exports = htmlText;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/label-end.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEndingOrSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending-or-space.js [app-ssr] (ecmascript)");
var chunkedPush = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-push.js [app-ssr] (ecmascript)");
var chunkedSplice = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/chunked-splice.js [app-ssr] (ecmascript)");
var normalizeIdentifier = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/normalize-identifier.js [app-ssr] (ecmascript)");
var resolveAll = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/resolve-all.js [app-ssr] (ecmascript)");
var shallow = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/shallow.js [app-ssr] (ecmascript)");
var factoryDestination = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-destination.js [app-ssr] (ecmascript)");
var factoryLabel = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-label.js [app-ssr] (ecmascript)");
var factoryTitle = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-title.js [app-ssr] (ecmascript)");
var factoryWhitespace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-whitespace.js [app-ssr] (ecmascript)");
var labelEnd = {
    name: 'labelEnd',
    tokenize: tokenizeLabelEnd,
    resolveTo: resolveToLabelEnd,
    resolveAll: resolveAllLabelEnd
};
var resourceConstruct = {
    tokenize: tokenizeResource
};
var fullReferenceConstruct = {
    tokenize: tokenizeFullReference
};
var collapsedReferenceConstruct = {
    tokenize: tokenizeCollapsedReference
};
function resolveAllLabelEnd(events) {
    var index = -1;
    var token;
    while(++index < events.length){
        token = events[index][1];
        if (!token._used && (token.type === 'labelImage' || token.type === 'labelLink' || token.type === 'labelEnd')) {
            // Remove the marker.
            events.splice(index + 1, token.type === 'labelImage' ? 4 : 2);
            token.type = 'data';
            index++;
        }
    }
    return events;
}
function resolveToLabelEnd(events, context) {
    var index = events.length;
    var offset = 0;
    var group;
    var label;
    var text;
    var token;
    var open;
    var close;
    var media // Find an opening.
    ;
    while(index--){
        token = events[index][1];
        if (open) {
            // If we see another link, or inactive link label, we’ve been here before.
            if (token.type === 'link' || token.type === 'labelLink' && token._inactive) {
                break;
            } // Mark other link openings as inactive, as we can’t have links in
            // links.
            if (events[index][0] === 'enter' && token.type === 'labelLink') {
                token._inactive = true;
            }
        } else if (close) {
            if (events[index][0] === 'enter' && (token.type === 'labelImage' || token.type === 'labelLink') && !token._balanced) {
                open = index;
                if (token.type !== 'labelLink') {
                    offset = 2;
                    break;
                }
            }
        } else if (token.type === 'labelEnd') {
            close = index;
        }
    }
    group = {
        type: events[open][1].type === 'labelLink' ? 'link' : 'image',
        start: shallow(events[open][1].start),
        end: shallow(events[events.length - 1][1].end)
    };
    label = {
        type: 'label',
        start: shallow(events[open][1].start),
        end: shallow(events[close][1].end)
    };
    text = {
        type: 'labelText',
        start: shallow(events[open + offset + 2][1].end),
        end: shallow(events[close - 2][1].start)
    };
    media = [
        [
            'enter',
            group,
            context
        ],
        [
            'enter',
            label,
            context
        ]
    ]; // Opening marker.
    media = chunkedPush(media, events.slice(open + 1, open + offset + 3)); // Text open.
    media = chunkedPush(media, [
        [
            'enter',
            text,
            context
        ]
    ]); // Between.
    media = chunkedPush(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context)); // Text close, marker close, label close.
    media = chunkedPush(media, [
        [
            'exit',
            text,
            context
        ],
        events[close - 2],
        events[close - 1],
        [
            'exit',
            label,
            context
        ]
    ]); // Reference, resource, or so.
    media = chunkedPush(media, events.slice(close + 1)); // Media close.
    media = chunkedPush(media, [
        [
            'exit',
            group,
            context
        ]
    ]);
    chunkedSplice(events, open, events.length, media);
    return events;
}
function tokenizeLabelEnd(effects, ok, nok) {
    var self = this;
    var index = self.events.length;
    var labelStart;
    var defined // Find an opening.
    ;
    while(index--){
        if ((self.events[index][1].type === 'labelImage' || self.events[index][1].type === 'labelLink') && !self.events[index][1]._balanced) {
            labelStart = self.events[index][1];
            break;
        }
    }
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        if (!labelStart) {
            return nok(code);
        } // It’s a balanced bracket, but contains a link.
        if (labelStart._inactive) return balanced(code);
        defined = self.parser.defined.indexOf(normalizeIdentifier(self.sliceSerialize({
            start: labelStart.end,
            end: self.now()
        }))) > -1;
        effects.enter('labelEnd');
        effects.enter('labelMarker');
        effects.consume(code);
        effects.exit('labelMarker');
        effects.exit('labelEnd');
        return afterLabelEnd;
    }
    function afterLabelEnd(code) {
        // Resource: `[asd](fgh)`.
        if (code === 40) {
            return effects.attempt(resourceConstruct, ok, defined ? ok : balanced)(code);
        } // Collapsed (`[asd][]`) or full (`[asd][fgh]`) reference?
        if (code === 91) {
            return effects.attempt(fullReferenceConstruct, ok, defined ? effects.attempt(collapsedReferenceConstruct, ok, balanced) : balanced)(code);
        } // Shortcut reference: `[asd]`?
        return defined ? ok(code) : balanced(code);
    }
    function balanced(code) {
        labelStart._balanced = true;
        return nok(code);
    }
}
function tokenizeResource(effects, ok, nok) {
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('resource');
        effects.enter('resourceMarker');
        effects.consume(code);
        effects.exit('resourceMarker');
        return factoryWhitespace(effects, open);
    }
    function open(code) {
        if (code === 41) {
            return end(code);
        }
        return factoryDestination(effects, destinationAfter, nok, 'resourceDestination', 'resourceDestinationLiteral', 'resourceDestinationLiteralMarker', 'resourceDestinationRaw', 'resourceDestinationString', 3)(code);
    }
    function destinationAfter(code) {
        return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, between)(code) : end(code);
    }
    function between(code) {
        if (code === 34 || code === 39 || code === 40) {
            return factoryTitle(effects, factoryWhitespace(effects, end), nok, 'resourceTitle', 'resourceTitleMarker', 'resourceTitleString')(code);
        }
        return end(code);
    }
    function end(code) {
        if (code === 41) {
            effects.enter('resourceMarker');
            effects.consume(code);
            effects.exit('resourceMarker');
            effects.exit('resource');
            return ok;
        }
        return nok(code);
    }
}
function tokenizeFullReference(effects, ok, nok) {
    var self = this;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        return factoryLabel.call(self, effects, afterLabel, nok, 'reference', 'referenceMarker', 'referenceString')(code);
    }
    function afterLabel(code) {
        return self.parser.defined.indexOf(normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1))) < 0 ? nok(code) : ok(code);
    }
}
function tokenizeCollapsedReference(effects, ok, nok) {
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('reference');
        effects.enter('referenceMarker');
        effects.consume(code);
        effects.exit('referenceMarker');
        return open;
    }
    function open(code) {
        if (code === 93) {
            effects.enter('referenceMarker');
            effects.consume(code);
            effects.exit('referenceMarker');
            effects.exit('reference');
            return ok;
        }
        return nok(code);
    }
}
module.exports = labelEnd;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/label-start-image.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var labelEnd = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/label-end.js [app-ssr] (ecmascript)");
var labelStartImage = {
    name: 'labelStartImage',
    tokenize: tokenizeLabelStartImage,
    resolveAll: labelEnd.resolveAll
};
function tokenizeLabelStartImage(effects, ok, nok) {
    var self = this;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('labelImage');
        effects.enter('labelImageMarker');
        effects.consume(code);
        effects.exit('labelImageMarker');
        return open;
    }
    function open(code) {
        if (code === 91) {
            effects.enter('labelMarker');
            effects.consume(code);
            effects.exit('labelMarker');
            effects.exit('labelImage');
            return after;
        }
        return nok(code);
    }
    function after(code) {
        /* c8 ignore next */ return code === 94 && /* c8 ignore next */ '_hiddenFootnoteSupport' in self.parser.constructs ? /* c8 ignore next */ nok(code) : ok(code);
    }
}
module.exports = labelStartImage;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/label-start-link.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var labelEnd = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/label-end.js [app-ssr] (ecmascript)");
var labelStartLink = {
    name: 'labelStartLink',
    tokenize: tokenizeLabelStartLink,
    resolveAll: labelEnd.resolveAll
};
function tokenizeLabelStartLink(effects, ok, nok) {
    var self = this;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('labelLink');
        effects.enter('labelMarker');
        effects.consume(code);
        effects.exit('labelMarker');
        effects.exit('labelLink');
        return after;
    }
    function after(code) {
        /* c8 ignore next */ return code === 94 && /* c8 ignore next */ '_hiddenFootnoteSupport' in self.parser.constructs ? /* c8 ignore next */ nok(code) : ok(code);
    }
}
module.exports = labelStartLink;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/line-ending.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var lineEnding = {
    name: 'lineEnding',
    tokenize: tokenizeLineEnding
};
function tokenizeLineEnding(effects, ok) {
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return factorySpace(effects, ok, 'linePrefix');
    }
}
module.exports = lineEnding;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/thematic-break.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var markdownSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-space.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var thematicBreak = {
    name: 'thematicBreak',
    tokenize: tokenizeThematicBreak
};
function tokenizeThematicBreak(effects, ok, nok) {
    var size = 0;
    var marker;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        effects.enter('thematicBreak');
        marker = code;
        return atBreak(code);
    }
    function atBreak(code) {
        if (code === marker) {
            effects.enter('thematicBreakSequence');
            return sequence(code);
        }
        if (markdownSpace(code)) {
            return factorySpace(effects, atBreak, 'whitespace')(code);
        }
        if (size < 3 || code !== null && !markdownLineEnding(code)) {
            return nok(code);
        }
        effects.exit('thematicBreak');
        return ok(code);
    }
    function sequence(code) {
        if (code === marker) {
            effects.consume(code);
            size++;
            return sequence;
        }
        effects.exit('thematicBreakSequence');
        return atBreak(code);
    }
}
module.exports = thematicBreak;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/list.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var asciiDigit = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/ascii-digit.js [app-ssr] (ecmascript)");
var markdownSpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-space.js [app-ssr] (ecmascript)");
var prefixSize = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/prefix-size.js [app-ssr] (ecmascript)");
var sizeChunks = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/size-chunks.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var partialBlankLine = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/partial-blank-line.js [app-ssr] (ecmascript)");
var thematicBreak = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/thematic-break.js [app-ssr] (ecmascript)");
var list = {
    name: 'list',
    tokenize: tokenizeListStart,
    continuation: {
        tokenize: tokenizeListContinuation
    },
    exit: tokenizeListEnd
};
var listItemPrefixWhitespaceConstruct = {
    tokenize: tokenizeListItemPrefixWhitespace,
    partial: true
};
var indentConstruct = {
    tokenize: tokenizeIndent,
    partial: true
};
function tokenizeListStart(effects, ok, nok) {
    var self = this;
    var initialSize = prefixSize(self.events, 'linePrefix');
    var size = 0;
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        var kind = self.containerState.type || (code === 42 || code === 43 || code === 45 ? 'listUnordered' : 'listOrdered');
        if (kind === 'listUnordered' ? !self.containerState.marker || code === self.containerState.marker : asciiDigit(code)) {
            if (!self.containerState.type) {
                self.containerState.type = kind;
                effects.enter(kind, {
                    _container: true
                });
            }
            if (kind === 'listUnordered') {
                effects.enter('listItemPrefix');
                return code === 42 || code === 45 ? effects.check(thematicBreak, nok, atMarker)(code) : atMarker(code);
            }
            if (!self.interrupt || code === 49) {
                effects.enter('listItemPrefix');
                effects.enter('listItemValue');
                return inside(code);
            }
        }
        return nok(code);
    }
    function inside(code) {
        if (asciiDigit(code) && ++size < 10) {
            effects.consume(code);
            return inside;
        }
        if ((!self.interrupt || size < 2) && (self.containerState.marker ? code === self.containerState.marker : code === 41 || code === 46)) {
            effects.exit('listItemValue');
            return atMarker(code);
        }
        return nok(code);
    }
    function atMarker(code) {
        effects.enter('listItemMarker');
        effects.consume(code);
        effects.exit('listItemMarker');
        self.containerState.marker = self.containerState.marker || code;
        return effects.check(partialBlankLine, self.interrupt ? nok : onBlank, effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix));
    }
    function onBlank(code) {
        self.containerState.initialBlankLine = true;
        initialSize++;
        return endOfPrefix(code);
    }
    function otherPrefix(code) {
        if (markdownSpace(code)) {
            effects.enter('listItemPrefixWhitespace');
            effects.consume(code);
            effects.exit('listItemPrefixWhitespace');
            return endOfPrefix;
        }
        return nok(code);
    }
    function endOfPrefix(code) {
        self.containerState.size = initialSize + sizeChunks(self.sliceStream(effects.exit('listItemPrefix')));
        return ok(code);
    }
}
function tokenizeListContinuation(effects, ok, nok) {
    var self = this;
    self.containerState._closeFlow = undefined;
    return effects.check(partialBlankLine, onBlank, notBlank);
    //TURBOPACK unreachable
    ;
    function onBlank(code) {
        self.containerState.furtherBlankLines = self.containerState.furtherBlankLines || self.containerState.initialBlankLine; // We have a blank line.
        // Still, try to consume at most the items size.
        return factorySpace(effects, ok, 'listItemIndent', self.containerState.size + 1)(code);
    }
    function notBlank(code) {
        if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
            self.containerState.furtherBlankLines = self.containerState.initialBlankLine = undefined;
            return notInCurrentItem(code);
        }
        self.containerState.furtherBlankLines = self.containerState.initialBlankLine = undefined;
        return effects.attempt(indentConstruct, ok, notInCurrentItem)(code);
    }
    function notInCurrentItem(code) {
        // While we do continue, we signal that the flow should be closed.
        self.containerState._closeFlow = true; // As we’re closing flow, we’re no longer interrupting.
        self.interrupt = undefined;
        return factorySpace(effects, effects.attempt(list, ok, nok), 'linePrefix', self.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4)(code);
    }
}
function tokenizeIndent(effects, ok, nok) {
    var self = this;
    return factorySpace(effects, afterPrefix, 'listItemIndent', self.containerState.size + 1);
    //TURBOPACK unreachable
    ;
    function afterPrefix(code) {
        return prefixSize(self.events, 'listItemIndent') === self.containerState.size ? ok(code) : nok(code);
    }
}
function tokenizeListEnd(effects) {
    effects.exit(this.containerState.type);
}
function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
    var self = this;
    return factorySpace(effects, afterPrefix, 'listItemPrefixWhitespace', self.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4 + 1);
    //TURBOPACK unreachable
    ;
    function afterPrefix(code) {
        return markdownSpace(code) || !prefixSize(self.events, 'listItemPrefixWhitespace') ? nok(code) : ok(code);
    }
}
module.exports = list;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/setext-underline.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var markdownLineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/character/markdown-line-ending.js [app-ssr] (ecmascript)");
var shallow = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/shallow.js [app-ssr] (ecmascript)");
var factorySpace = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/factory-space.js [app-ssr] (ecmascript)");
var setextUnderline = {
    name: 'setextUnderline',
    tokenize: tokenizeSetextUnderline,
    resolveTo: resolveToSetextUnderline
};
function resolveToSetextUnderline(events, context) {
    var index = events.length;
    var content;
    var text;
    var definition;
    var heading // Find the opening of the content.
    ;
    // It’ll always exist: we don’t tokenize if it isn’t there.
    while(index--){
        if (events[index][0] === 'enter') {
            if (events[index][1].type === 'content') {
                content = index;
                break;
            }
            if (events[index][1].type === 'paragraph') {
                text = index;
            }
        } else {
            if (events[index][1].type === 'content') {
                // Remove the content end (if needed we’ll add it later)
                events.splice(index, 1);
            }
            if (!definition && events[index][1].type === 'definition') {
                definition = index;
            }
        }
    }
    heading = {
        type: 'setextHeading',
        start: shallow(events[text][1].start),
        end: shallow(events[events.length - 1][1].end)
    }; // Change the paragraph to setext heading text.
    events[text][1].type = 'setextHeadingText'; // If we have definitions in the content, we’ll keep on having content,
    // but we need move it.
    if (definition) {
        events.splice(text, 0, [
            'enter',
            heading,
            context
        ]);
        events.splice(definition + 1, 0, [
            'exit',
            events[content][1],
            context
        ]);
        events[content][1].end = shallow(events[definition][1].end);
    } else {
        events[content][1] = heading;
    } // Add the heading exit at the end.
    events.push([
        'exit',
        heading,
        context
    ]);
    return events;
}
function tokenizeSetextUnderline(effects, ok, nok) {
    var self = this;
    var index = self.events.length;
    var marker;
    var paragraph // Find an opening.
    ;
    while(index--){
        // Skip enter/exit of line ending, line prefix, and content.
        // We can now either have a definition or a paragraph.
        if (self.events[index][1].type !== 'lineEnding' && self.events[index][1].type !== 'linePrefix' && self.events[index][1].type !== 'content') {
            paragraph = self.events[index][1].type === 'paragraph';
            break;
        }
    }
    return start;
    //TURBOPACK unreachable
    ;
    function start(code) {
        if (!self.lazy && (self.interrupt || paragraph)) {
            effects.enter('setextHeadingLine');
            effects.enter('setextHeadingLineSequence');
            marker = code;
            return closingSequence(code);
        }
        return nok(code);
    }
    function closingSequence(code) {
        if (code === marker) {
            effects.consume(code);
            return closingSequence;
        }
        effects.exit('setextHeadingLineSequence');
        return factorySpace(effects, closingSequenceEnd, 'lineSuffix')(code);
    }
    function closingSequenceEnd(code) {
        if (code === null || markdownLineEnding(code)) {
            effects.exit('setextHeadingLine');
            return ok(code);
        }
        return nok(code);
    }
}
module.exports = setextUnderline;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/constructs.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
var text$1 = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/initialize/text.js [app-ssr] (ecmascript)");
var attention = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/attention.js [app-ssr] (ecmascript)");
var autolink = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/autolink.js [app-ssr] (ecmascript)");
var blockQuote = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/block-quote.js [app-ssr] (ecmascript)");
var characterEscape = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/character-escape.js [app-ssr] (ecmascript)");
var characterReference = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/character-reference.js [app-ssr] (ecmascript)");
var codeFenced = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/code-fenced.js [app-ssr] (ecmascript)");
var codeIndented = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/code-indented.js [app-ssr] (ecmascript)");
var codeText = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/code-text.js [app-ssr] (ecmascript)");
var definition = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/definition.js [app-ssr] (ecmascript)");
var hardBreakEscape = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/hard-break-escape.js [app-ssr] (ecmascript)");
var headingAtx = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/heading-atx.js [app-ssr] (ecmascript)");
var htmlFlow = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/html-flow.js [app-ssr] (ecmascript)");
var htmlText = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/html-text.js [app-ssr] (ecmascript)");
var labelEnd = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/label-end.js [app-ssr] (ecmascript)");
var labelStartImage = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/label-start-image.js [app-ssr] (ecmascript)");
var labelStartLink = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/label-start-link.js [app-ssr] (ecmascript)");
var lineEnding = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/line-ending.js [app-ssr] (ecmascript)");
var list = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/list.js [app-ssr] (ecmascript)");
var setextUnderline = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/setext-underline.js [app-ssr] (ecmascript)");
var thematicBreak = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/tokenize/thematic-break.js [app-ssr] (ecmascript)");
var document = {
    42: list,
    // Asterisk
    43: list,
    // Plus sign
    45: list,
    // Dash
    48: list,
    // 0
    49: list,
    // 1
    50: list,
    // 2
    51: list,
    // 3
    52: list,
    // 4
    53: list,
    // 5
    54: list,
    // 6
    55: list,
    // 7
    56: list,
    // 8
    57: list,
    // 9
    62: blockQuote // Greater than
};
var contentInitial = {
    91: definition // Left square bracket
};
var flowInitial = {
    '-2': codeIndented,
    // Horizontal tab
    '-1': codeIndented,
    // Virtual space
    32: codeIndented // Space
};
var flow = {
    35: headingAtx,
    // Number sign
    42: thematicBreak,
    // Asterisk
    45: [
        setextUnderline,
        thematicBreak
    ],
    // Dash
    60: htmlFlow,
    // Less than
    61: setextUnderline,
    // Equals to
    95: thematicBreak,
    // Underscore
    96: codeFenced,
    // Grave accent
    126: codeFenced // Tilde
};
var string = {
    38: characterReference,
    // Ampersand
    92: characterEscape // Backslash
};
var text = {
    '-5': lineEnding,
    // Carriage return
    '-4': lineEnding,
    // Line feed
    '-3': lineEnding,
    // Carriage return + line feed
    33: labelStartImage,
    // Exclamation mark
    38: characterReference,
    // Ampersand
    42: attention,
    // Asterisk
    60: [
        autolink,
        htmlText
    ],
    // Less than
    91: labelStartLink,
    // Left square bracket
    92: [
        hardBreakEscape,
        characterEscape
    ],
    // Backslash
    93: labelEnd,
    // Right square bracket
    95: attention,
    // Underscore
    96: codeText // Grave accent
};
var insideSpan = {
    null: [
        attention,
        text$1.resolver
    ]
};
var disable = {
    null: []
};
exports.contentInitial = contentInitial;
exports.disable = disable;
exports.document = document;
exports.flow = flow;
exports.flowInitial = flowInitial;
exports.insideSpan = insideSpan;
exports.string = string;
exports.text = text;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/parse.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var content = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/initialize/content.js [app-ssr] (ecmascript)");
var document = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/initialize/document.js [app-ssr] (ecmascript)");
var flow = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/initialize/flow.js [app-ssr] (ecmascript)");
var text = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/initialize/text.js [app-ssr] (ecmascript)");
var combineExtensions = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/combine-extensions.js [app-ssr] (ecmascript)");
var createTokenizer = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/create-tokenizer.js [app-ssr] (ecmascript)");
var miniflat = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/miniflat.js [app-ssr] (ecmascript)");
var constructs = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/constructs.js [app-ssr] (ecmascript)");
function parse(options) {
    var settings = options || {};
    var parser = {
        defined: [],
        constructs: combineExtensions([
            constructs
        ].concat(miniflat(settings.extensions))),
        content: create(content),
        document: create(document),
        flow: create(flow),
        string: create(text.string),
        text: create(text.text)
    };
    return parser;
    //TURBOPACK unreachable
    ;
    function create(initializer) {
        return creator;
        //TURBOPACK unreachable
        ;
        function creator(from) {
            return createTokenizer(parser, initializer, from);
        }
    }
}
module.exports = parse;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/preprocess.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var search = /[\0\t\n\r]/g;
function preprocess() {
    var start = true;
    var column = 1;
    var buffer = '';
    var atCarriageReturn;
    return preprocessor;
    //TURBOPACK unreachable
    ;
    function preprocessor(value, encoding, end) {
        var chunks = [];
        var match;
        var next;
        var startPosition;
        var endPosition;
        var code;
        value = buffer + value.toString(encoding);
        startPosition = 0;
        buffer = '';
        if (start) {
            if (value.charCodeAt(0) === 65279) {
                startPosition++;
            }
            start = undefined;
        }
        while(startPosition < value.length){
            search.lastIndex = startPosition;
            match = search.exec(value);
            endPosition = match ? match.index : value.length;
            code = value.charCodeAt(endPosition);
            if (!match) {
                buffer = value.slice(startPosition);
                break;
            }
            if (code === 10 && startPosition === endPosition && atCarriageReturn) {
                chunks.push(-3);
                atCarriageReturn = undefined;
            } else {
                if (atCarriageReturn) {
                    chunks.push(-5);
                    atCarriageReturn = undefined;
                }
                if (startPosition < endPosition) {
                    chunks.push(value.slice(startPosition, endPosition));
                    column += endPosition - startPosition;
                }
                if (code === 0) {
                    chunks.push(65533);
                    column++;
                } else if (code === 9) {
                    next = Math.ceil(column / 4) * 4;
                    chunks.push(-2);
                    while(column++ < next)chunks.push(-1);
                } else if (code === 10) {
                    chunks.push(-4);
                    column = 1;
                } else {
                    atCarriageReturn = true;
                    column = 1;
                }
            }
            startPosition = endPosition + 1;
        }
        if (end) {
            if (atCarriageReturn) chunks.push(-5);
            if (buffer) chunks.push(buffer);
            chunks.push(null);
        }
        return chunks;
    }
}
module.exports = preprocess;
}),
"[project]/node_modules/mml-react/node_modules/micromark/dist/postprocess.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var subtokenize = __turbopack_context__.r("[project]/node_modules/mml-react/node_modules/micromark/dist/util/subtokenize.js [app-ssr] (ecmascript)");
function postprocess(events) {
    while(!subtokenize(events)){
    // Empty
    }
    return events;
}
module.exports = postprocess;
}),
];

//# sourceMappingURL=df1fa_micromark_dist_45a299c1._.js.map