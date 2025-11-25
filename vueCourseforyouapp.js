
const app = new Vue({
    el: '#app',
    data: {
        sitename: 'Courses for you',
        lessons: [],
        cart: [],
        showCartPage: false,
        showOrderConfirmation: false,
        checkoutName: '',
        checkoutPhone: '',
        confirmedOrderDetails: null,
        apiBaseUrl: 'https://expressjs-flj.onrender.com/api', // Corrected API Base URL
        sortKey: 'Lesson',
        sortOrder: 'Ascending',
        searchQuery: ''
    },
    created( ) {
        this.fetchLessons();
    },
    methods: {
        fetchLessons() {
            fetch(`${this.apiBaseUrl}/lessons`) // Corrected fetch call
                .then(response => {
                    if (!response.ok) {
                        throw new Error('HTTP error! status: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    this.lessons = data;
                })
                .catch(error => {
                    console.error('Error fetching lessons:', error);
                    // Fallback to hardcoded data if API fails
                    this.lessons = [
                        { id: 1, topic: 'Math', location: 'Hendon', price: 50, spaces: 5, image: 'images/math.png' },
                        { id: 2, topic: 'English', location: 'Hendon', price: 55, spaces: 5, image: 'images/english.png' },
                        { id: 3, topic: 'Science', location: 'Hendon', price: 40, spaces: 5, image: 'images/science.png' },
                        { id: 4, topic: 'History', location: 'Barnet', price: 55, spaces: 5, image: 'images/history.png' },
                        { id: 5, topic: 'Geography', location: 'Harrow', price: 45, spaces: 5, image: 'images/geography.png' },
                        { id: 6, topic: 'Art', location: 'Barnet', price: 35, spaces: 5, image: 'images/art.png' },
                        { id: 7, topic: 'Music', location: 'Harrow', price: 30, spaces: 5, image: 'images/music.png' },
                        { id: 8, topic: 'Basketball', location: 'Harrow', price: 35, spaces: 5, image: 'images/basketball.png' },
                        { id: 9, topic: 'Football', location: 'Barnet', price: 40, spaces: 5, image: 'images/football.png' },
                        { id: 10, topic: 'Coding', location: 'Barnet', price: 60, spaces: 5, image: 'images/coding.png' }
                    ];
                });
        },
        addToCart: function(lesson) {
            // Corrected logic to add item to cart
            const cartIndex = this.cart.findIndex(item => item.id === lesson.id);

            if (cartIndex > -1) {
                this.cart[cartIndex].quantity++;
            } else {
                this.cart.push({
                    id: lesson.id,
                    topic: lesson.topic,
                    location: lesson.location,
                    price: lesson.price,
                    quantity: 1
                });
            }
            lesson.spaces--;
        },
        removeFromCart: function(lesson) {
            const cartIndex = this.cart.findIndex(item => item.id === lesson.id);
            if (cartIndex > -1) {
                this.cart[cartIndex].quantity--;
                this.lessons.find(l => l.id === lesson.id).spaces++;
                if (this.cart[cartIndex].quantity === 0) {
                    this.cart.splice(cartIndex, 1);
                }
            }
        },
        viewCart: function() {
            this.showCartPage = true;
        },
        backToLessons: function() {
            this.showCartPage = false;
            this.showOrderConfirmation = false;
        },
        checkout: function() {
            if (this.cart.length === 0) {
                alert('Your cart is empty. Please add lessons before checking out.');
                return;
            }

            const order = {
                name: this.checkoutName,
                phone: this.checkoutPhone,
                lessons: this.cart.map(item => ({
                    id: item.id,
                    quantity: item.quantity
                }))
            };

            // 1. Save the order
            fetch(`${this.apiBaseUrl}/orders`, { // Corrected fetch call
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Order processing failed: ' + response.statusText);
                }
                return response.json();
            })
            .then(savedOrder => {
                // 2. Update lesson spaces
                const updatePromises = this.cart.map(item => {
                    return this.updateLessonSpaces(item.id, item.quantity);
                });

                return Promise.all(updatePromises).then(() => savedOrder);
            })
            .then(savedOrder => {
                // Corrected state management for confirmation message
                const orderNumber = savedOrder._id || savedOrder.order?._id || 'ORD' + Date.now();
                const cartItemsSnapshot = [...this.cart]; // Snapshot the cart before clearing

                this.confirmedOrderDetails = {
                    orderNumber: orderNumber,
                    name: this.checkoutName,
                    phone: this.checkoutPhone,
                    items: cartItemsSnapshot, // Use the snapshot
                    total: this.cartTotal
                };

                // Clear form data and cart
                this.cart = [];
                this.checkoutName = '';
                this.checkoutPhone = '';

                // Show confirmation message and hide cart page
                this.showOrderConfirmation = true;
                this.showCartPage = false;

                // Set a timeout to hide the confirmation message after 9 seconds
                setTimeout(() => {
                    this.showOrderConfirmation = false;
                }, 9000);

                // Refresh lessons from backend to get updated spaces
                this.fetchLessons();
            })
            .catch(error => {
                alert('There was an error processing your order. Please try again. Error: ' + error.message);
                console.error('Checkout error:', error);
            });
        },
        updateLessonSpaces: function(lessonId, quantity) {
            return fetch(`${this.apiBaseUrl}/lessons/${lessonId}`, { // Corrected fetch call
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: quantity }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update lesson spaces for ID: ' + lessonId);
                }
                return response.json();
            });
        }
    },
    computed: {
        cartTotal: function() {
            return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        cartItemCount: function() {
            return this.cart.reduce((total, item) => total + item.quantity, 0);
        },
        filteredLessons: function() {
            let lessons = this.lessons;

            // Apply search filter
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                lessons = lessons.filter(lesson =>
                    lesson.topic.toLowerCase().includes(query) ||
                    lesson.location.toLowerCase().includes(query)
                );
            }

            // Apply sorting
            lessons.sort((a, b) => {
                let comparison = 0;
                const key = this.sortKey.toLowerCase().replace(' ', '');

                if (a[key] > b[key]) {
                    comparison = 1;
                } else if (a[key] < b[key]) {
                    comparison = -1;
                }

                return this.sortOrder === 'Ascending' ? comparison : comparison * -1;
            });

            return lessons;
        },
        canCheckout: function() {
            return this.checkoutName && this.checkoutPhone && this.cart.length > 0;
        }
    }
});
