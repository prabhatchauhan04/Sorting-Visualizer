const sizeChoice = document.querySelector("#size-choice");
const algoChoice = document.querySelector('#algo-choice');
const speedChoice = document.querySelector('#speed-choice');
const generateArrayButton = document.querySelector('#generate-array');
const arrayBox = document.querySelector('.array-box');
const sortButton = document.querySelector('#sort');
const description = document.querySelector('#description');
let array = []; // Initialize an empty array

// Function to change the description based on the selected algorithm
function changeDescription() {
    const algo = algoChoice.value;
    const desc = {
        bubble: "Bubble Sort repeatedly compares and swaps adjacent elements until the array is sorted. It’s simple but inefficient for large datasets. Time: O(n²) worst, O(n) best. Space: O(1), in-place.",
        selection: "Selection Sort selects the smallest element and places it at the correct position. It always runs in O(n²) time, regardless of input. Simple but slow. Space: O(1), in-place.",
        insertion: "Insertion Sort inserts elements into their correct position one at a time. Efficient for small or nearly sorted arrays. Time: O(n²) worst, O(n) best. Space: O(1), in-place.",
        merge: "Merge Sort divides the array, sorts each half, and merges them. It's stable and efficient for large data. Time: O(n log n) always. Space: O(n), not in-place.",
        quick: "Quick Sort picks a pivot and partitions the array around it recursively. Fast and widely used. Time: O(n log n) avg, O(n²) worst. Space: O(log n), in-place.",
        default: "This visualizer shows how sorting algorithms organize data step by step. Each bar represents a value, and its height indicates its size. Select a sorting algorithm, adjust the array size and speed, and watch the magic unfold!"
    }
    description.textContent = desc[algo] || desc.default;
}
algoChoice.addEventListener('change', changeDescription);

// Function to generate a random array
function generateRandomArray(size) {
    const newarray = [];
    for (let i = 0; i < size; i++) {
        newarray.push(Math.floor(Math.random() * 100) + 1);
    }
    return newarray;
}
// Function to display the array in the array box
function displayArray(array) {
    arrayBox.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value * 3}px`; // Scale height for better visibility
        bar.style.width = `${100 / array.length}%`;
        bar.style.backgroundColor = '#4e4c50ff';
        bar.style.display = 'inline-block';
        bar.style.border = '1px solid #000';
        bar.style.boxSizing = 'border-box';
        arrayBox.appendChild(bar);
    });
}
sizeChoice.addEventListener('change', () => {
    const size = parseInt(sizeChoice.value);
    if (size) {
        array = generateRandomArray(size);
        displayArray(array);
    } else {
        arrayBox.innerHTML = '';
    }
});

// alert for invalid size input
const overlay = document.getElementById('overlay');
const alertBox = document.getElementById('custom-alert');
const closeBtn = document.getElementById('close-alert');

function showAlert() {
    overlay.style.display = 'block';
    alertBox.style.display = 'block';
}

function hideAlert() {
    overlay.style.display = 'none';
    alertBox.style.display = 'none';
}

closeBtn.addEventListener('click', hideAlert);
overlay.addEventListener('click', hideAlert);

generateArrayButton.addEventListener('click', () => {
    const size = parseInt(sizeChoice.value);
    if (size) {
        array = generateRandomArray(size);
        displayArray(array);
    } else {
        showAlert();
    }
});

// Function to sort the array using the selected algorithm & alert box for sort button

const overlaySort = document.getElementById('overlay-sort');
const alertSort = document.getElementById('custom-alert-sort');
const closeBtnSort = document.getElementById('close-alert-sort');

function showSortAlert() {
    overlaySort.style.display = 'block';
    alertSort.style.display = 'block';
}

function hideSortAlert() {
    overlaySort.style.display = 'none';
    alertSort.style.display = 'none';
}

closeBtnSort.addEventListener('click', hideSortAlert);
overlaySort.addEventListener('click', hideSortAlert);

sortButton.addEventListener('click', async () => {
    const algo = algoChoice.value;
    const size = sizeChoice.value;
    const speed = speedChoice.value;

    if (!algo || !size || !speed) {
        showSortAlert();
    } else {
        await startSort(algo, speed);
    }
    // Call your sorting function here
    // e.g. startSort(algo, size, speed);
});

async function startSort(algo, speed) {
    // 1000 ms is just used as a reference for the delay
    const delay = 1000 / speed; // Adjust delay based on speed
    switch (algo) {
        case 'bubble':
            await bubbleSort(array, delay);
            break;
        case 'selection':
            await selectionSort(array, delay);
            break;
        case 'insertion':
            await insertionSort(array, delay);
            break;
        case 'merge':
            await mergeSort(array, delay);
            break;
        case 'quick':
            await quickSort(array, delay);
            break;
    }
}

// Sorting algorithms implementation
async function swap(array, i, j, delay) {
    const bars = arrayBox.children;
    // highlight the bars being swapped
    bars[i].style.backgroundColor = '#6d00d4ff';
    bars[j].style.backgroundColor = '#6d00d4ff';
    // wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));
    // swap the elements in the array and update the bar heights
    [array[i], array[j]] = [array[j], array[i]];
    // update the heights of the bars
    bars[i].style.height = `${array[i] * 3}px`;
    bars[j].style.height = `${array[j] * 3}px`;
    // reset the colors of the bars
    bars[i].style.backgroundColor = '#4e4c50ff';
    bars[j].style.backgroundColor = '#4e4c50ff';
}

async function bubbleSort(array, delay) {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                await swap(array, j, j + 1, delay);
            }
        }
        arrayBox.children[array.length - 1 - i].style.backgroundColor = '#09ff00ff'; // Highlight the sorted part
    }
    // Color the 0th index green
    arrayBox.children[0].style.backgroundColor = '#09ff00ff';
}

async function selectionSort(array, delay) {
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            await swap(array, i, minIndex, delay);
        }
        arrayBox.children[i].style.backgroundColor = '#09ff00ff'; // Highlight the sorted part
    }
    arrayBox.children[array.length-1].style.backgroundColor = '#09ff00ff'; // Highlight the last element as sorted
}

async function insertionSort(array, delay) {
    const bars = arrayBox.children;

    for (let i = 1; i < array.length; i++) {
        let j = i;
        while (j > 0 && array[j - 1] > array[j]) {
            await swap(array, j - 1, j, delay);
            j--;
        }
        // Optional: mark the first j elements as sorted (green) so far
        for (let k = 0; k <= i; k++) {
            bars[k].style.backgroundColor = '#09ff00ff'; // green
        }
    }
}


async function mergeSort(array, delay) {
    const bars = arrayBox.children;
    async function merge(left, right, start, end) {
        let i = 0, j = 0, k = start;
        const merged = [];
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                merged.push(left[i++]);
            } else {
                merged.push(right[j++]);
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            bars[k].style.height = `${merged[merged.length - 1] * 3}px`;
            bars[k].style.backgroundColor = '#6d00d4ff';
            k++;
        }
        while (i < left.length) {
            merged.push(left[i++]);
            await new Promise(resolve => setTimeout(resolve, delay));
            bars[k].style.height = `${merged[merged.length - 1] * 3}px`;
            bars[k].style.backgroundColor = '#6d00d4ff';
            k++;
        }
        while (j < right.length) {
            merged.push(right[j++]);
            await new Promise(resolve => setTimeout(resolve, delay));
            bars[k].style.height = `${merged[merged.length - 1] * 3}px`;
            bars[k].style.backgroundColor = '#6d00d4ff';
            k++;
        }
        for (let m = 0; m < merged.length; m++) {
            array[start + m] = merged[m];
            bars[start + m].style.height = `${merged[m] * 3}px`;
            bars[start + m].style.backgroundColor = '#c4cb37ff'; 
        }
    }
    async function sort(start, end) {
        if (start < end) {
            const mid = Math.floor((start + end) / 2);
            await sort(start, mid);
            await sort(mid + 1, end);
            await merge(array.slice(start, mid + 1), array.slice(mid + 1, end + 1), start, end);
        }
    }
    await sort(0, array.length - 1);
    // After full merge sort is done:
    for (let i = 0; i < array.length; i++) {
        bars[i].style.backgroundColor = '#09ff00ff'; // green
    }
}

async function quickSort(array, delay) {
    const bars = arrayBox.children;
    async function partition(low, high) {
        let pivot = array[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (array[j] < pivot) {
                i++;
                await swap(array, i, j, delay);
            }
            bars[j].style.backgroundColor = '#6d00d4ff'; // highlight current element
        }
        await swap(array, i + 1, high, delay);
        return i + 1;
    }
    async function sort(low, high) {
        if (low < high) {
            const pi = await partition(low, high);
            bars[pi].style.backgroundColor = '#09ff00ff'; // highlight pivot
            await sort(low, pi - 1);
            await sort(pi + 1, high);
        }
        for (let i = low; i <= high; i++) {
            bars[i].style.backgroundColor = '#09ff00ff'; // highlight sorted elements
        }
    }
    await sort(0, array.length - 1);
}
















































