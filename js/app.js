// Create a list that holds all of your cards
let symbols = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
    opened = [],
    match = 0,
    moves = 0,
    $deck = $('.deck'),
    $scorePanel = $('#score-panel'),
    $moveNum = $('.moves'),
    $ratingStars = $('.fa-star'),
    $restart = $('.restart'),
    delay = 400,
    currentTimer,
    second = 0,
    $timer = $('.timer'),
    totalCard = symbols.length / 2,
    rank3stars = 10,
    rank2stars = 16,
    rank1stars = 20;
    started = false;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// Initial GAME
function initGame() {
    var cards = shuffle(symbols);
    $deck.empty();
    match = 0;
    moves = 0;
    started = false;
    $moveNum.text('0');
    $ratingStars.removeClass('fa-star-o').addClass('fa-star');
    for (var i = 0; i < cards.length; i++) {
        $deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
    }
    addCardListener();

    resetTimer(currentTimer);
    second = 0;
    $timer.text(`${second}`)
    // initTime();
};

// Set Rating and the Final score
function setRating(moves) {
    var rating = 3;
    if (moves > rank3stars && moves < rank2stars) {
        $ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
        rating = 2;
    } else if (moves > rank2stars && moves < rank1stars) {
        $ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
    }
    return {
        score: rating
    };
};

// End the GAME
function endGame(moves, score) {
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Congratulations! Great memory!',
        text: 'With ' + moves + ' Moves and ' + score + ' Stars in ' + second + ' Seconds.\n Boom Shaka Laka!',
        type: 'success',
        confirmButtonColor: '#B2E647',
        confirmButtonText: 'Play Again!'
    }).then(function(isConfirm) {
        if (isConfirm) {
            initGame();
        }
    });
}

// Restart the GAME
$restart.on('click', function() {
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Are you sure?',
        text: "Your progress will be lost!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#B2E647',
        cancelButtonColor: '#FF427B',
        confirmButtonText: 'Yes, Restart Game!'
    }).then(function(isConfirm) {
        if (isConfirm) {
            initGame();
        }
    });
});

let addCardListener = function() {

    // Card Flipping
    $deck.find('.card').bind('click', function() {
        var $this = $(this);

        if (!started) {
          started = true;
          initTime();
        }

        if ($this.hasClass('show') || $this.hasClass('match')) {
            return true;
        }

        var card = $this.context.innerHTML;
        $this.addClass('open show');
        opened.push(card);

        // Compare with the opened cards
        if (opened.length > 1) {
            if (card === opened[0]) {
                $deck.find('.open').addClass('match animated infinite rubberBand');
                setTimeout(function() {
                    $deck.find('.match').removeClass('open show animated infinite rubberBand');
                }, delay);
                match++;
            } else {
                $deck.find('.open').addClass('notmatch animated infinite wobble');
                setTimeout(function() {
                    $deck.find('.open').removeClass('animated infinite wobble');
                }, delay / 1.5);
                setTimeout(function() {
                    $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
                }, delay);
            }
            opened = [];
            moves++;
            setRating(moves);
            $moveNum.html(moves);
        }

        // End the GAME when all cards match
        if (totalCard === match) {
            setRating(moves);
            var score = setRating(moves).score;
            setTimeout(function() {
                endGame(moves, score);
            }, 500);
        }
    });
};

function initTime() {
    currentTimer = setInterval(function() {
        $timer.text(`${second}`);
        second = second + 1;
    }, 1000);
}

function resetTimer(timer) {
    if (timer) {
        clearInterval(timer);
    }
}

initGame();
