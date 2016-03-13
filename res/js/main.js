$(document).ready(function() {

    var delimiters = [' ', ',', '\n'];
    console.log("Ready!");

    function clearSuggestions() {
        $('span.alt-emoji').remove();
    }

    function getSymbols(string) {
      var index = 0;
      var length = string.length;
      var output = [];
      for (; index < length - 1; ++index) {
        var charCode = string.charCodeAt(index); if (charCode >= 0xD800 && charCode <= 0xDBFF) {
          charCode = string.charCodeAt(index + 1);
          if (charCode >= 0xDC00 && charCode <= 0xDFFF) {
            output.push(string.slice(index, index + 2));
            ++index;
            continue;
          }
        }
        output.push(string.charAt(index));
      }
      output.push(string.charAt(index));
      return output;
    }
    var replaceAt = function(str, index, character) {
            return str.substr(0, index) + character + str.substr(index+character.length);
    }

    var findPreceedingSpace = function(str, index) {
        for (var spaceIndex = index; spaceIndex >= 0; spaceIndex--) {
            if ($.inArray(str[spaceIndex], delimiters) > -1) {
                return spaceIndex;
            }
        }
        return 0;
    };
    var getWordBeforeCursor = function() {
        var cursorPosition = $input.prop('selectionStart');
        var text = $input.val();

        // -2 because we just pressed space
        var prevWord = text.slice(findPreceedingSpace(text, cursorPosition - 2), cursorPosition - 1);
        return prevWord;
    }

    var replaceLast = function(str, pattern, replacement) {
        n = str.lastIndexOf(pattern);
        if (n !== -1) {
                return str.substring(0, n) + replacement + str.substring(n + pattern.length);
        }
        return null;
    }

    var replaceBeforeCursor = function(replacement) {
        // Replace the occurrence of `pattern` immediately before the cursor with `replacement`.

        var cursorPosition = $input.prop('selectionStart');
        var text = $input.val();
        var lastIndexOfPattern = text.lastIndexOf(pattern);
        var replacementText = text.substring(0, lastIndexOfPattern) + replacement + text.substring(lastIndexOfPattern + pattern.length);
        $input.val(replacementText);


    }

    var keycodes = [
            // Enter
            13,
            // .
            190,
            // ,
            188,
            // Shift,
            16,
            // Space
            32
    ];

    var $input = $('textarea#emoji');
    var $alt = $('span.alt');

    // Dynamically add click handlers as the emoji are created.
    $('div.alt').on('click', 'span.alt-emoji', function() {

        // It's fiiiine, just replace whatever's behind the cursor with the clicked thing.
        //$input.val(replaceAt($input.val(), $input.prop('selectionStart') - 2, $(this).attr('data-emoji')));

        var newInput = replaceLast($input.val(), $(this).attr('data-canonical-emoji'), $(this).attr('data-emoji'));
        $input.val(newInput);
        
        //replaceBeforeCursor($(this).attr('data-emoji'));
        clearSuggestions();
    });

    $input.click(function() {
        // Clear the suggestions when clicked.
        clearSuggestions();
    });

    $input.keyup(function(event) {
        //console.log($input.prop('selectionStart'));
        clearSuggestions();

        if ($.inArray(event.keyCode, keycodes) !== -1) {
            var prevWord = $.trim(getWordBeforeCursor());
            //console.log("prevword: " + '"' +  prevWord + '"');
            var emojiList = EMOJI_MAP[prevWord];
            console.table(emojiList);
            if (emojiList === undefined)  {
                return;
            }

            // XSS ME I DARE YOU
            $alt.html(emojiList.map(function(i) {
                return '<span class="alt-emoji" data-canonical-emoji="' + emojiList[0].emoji + '" data-emoji="' + i.emoji + '"' +'>' + i.emoji + '</span>';
            }).join(" "))
            var newInput = replaceLast($input.val(), prevWord, emojiList[0]["emoji"]);
            $input.val(newInput);
        }

    });


});
