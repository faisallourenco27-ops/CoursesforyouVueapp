
const app = new Vue({
    el: '#app',
    data: {
        // API and Data
        apiBaseUrl: 'https://expressjs-flj.onrender.com/api', // Corrected to include /api
        lessons: [],
        
        // Cart and Checkout
        cart: [],
        checkoutName: '',
        checkoutPhone: '',
        
        // UI State
        showCartPage: false,
        showOrderConfirmation: false, // State for showing the confirmation message
        confirmedOrderDetails: null, // To store details for the confirmation message
        
        // Sorting and Filtering
        sortBy: 'lesson',
        sortOrder: 'asc',
        
        // Modal
        showLessonModal: false,
        selectedLesson: null,
        
        // Fallback Lessons (Used if API fails)
        fallbackLessons: [
            { id: 1, lesson: 'Further Maths', location: 'Hendon', price: 50, spaces: 5, icon: 'https://media.istockphoto.com/id/1866121335/photo/physics-and-mathematics.webp?b=1&s=612x612&w=0&k=20&c=ND9gyyqbrA8GknNpbo4-Oy9vVKzaSJ6P3L2JvqYTYO0=', synopsis: 'An advanced course in mathematical concepts and techniques beyond standard curriculum.' },
            { id: 2, lesson: 'Art & Design', location: 'Hendon', price: 55, spaces: 5, icon: 'https://media.istockphoto.com/id/1372126412/photo/multiracial-students-painting-inside-art-room-class-at-school-focus-on-girl-face.webp?b=1&s=612x612&w=0&k=20&c=3KPEFUIEjH4IqegohqPiZmqieezUl4yMoLgHjhoxzQY=', synopsis: 'Explore creativity through various mediums including painting, sculpture, and digital art.' },
            { id: 3, lesson: 'Boxing', location: 'Barnet', price: 55, spaces: 5, icon: 'https://cdn.pixabay.com/photo/2012/10/25/23/32/boxing-62867_1280.jpg', synopsis: 'Learn the fundamentals of boxing, including techniques, fitness, and discipline.' },
            { id: 4, lesson: 'Karate', location: 'Barnet', price: 40, spaces: 5, icon: 'https://cdn.pixabay.com/photo/2022/01/28/07/39/marshall-6973880_1280.jpg', synopsis: 'A traditional martial arts course focusing on self-defense, discipline, and physical fitness.' },
            { id: 5, lesson: 'Football', location: 'Harrow', price: 35, spaces: 5, icon: 'https://cdn.pixabay.com/photo/2014/10/14/20/24/ball-488717_1280.jpg', synopsis: 'Develop your football skills, teamwork, and strategy in this engaging course.' },
            { id: 6, lesson: 'Drama', location: 'Harrow', price: 30, spaces: 5, icon: 'https://cdn.pixabay.com/photo/2022/07/30/01/18/actor-7352882_1280.jpg', synopsis: 'Enhance your acting skills, stage presence, and confidence through various drama exercises.' },
            { id: 7, lesson: 'Music', location: 'Barnet', price: 60, spaces: 5, icon: 'https://cdn.pixabay.com/photo/2020/06/29/19/26/piano-5353974_1280.jpg', synopsis: 'Learn to play musical instruments, understand music theory, and develop your musical talents.' },
            { id: 8, lesson: 'Basketball', location: 'Hendon', price: 40, spaces: 5, icon: 'https://cdn.pixabay.com/photo/2017/10/29/21/06/tahincioglu-basketball-super-league-2900843_1280.jpg', synopsis: 'Improve your basketball skills, teamwork, and game strategies in this dynamic course.' },
            { id: 9, lesson: 'Coding', location: 'Harrow', price: 45, spaces: 5, icon: 'https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536_1280.jpg', synopsis: 'Learn programming languages, software development, and problem-solving techniques.' },
            { id: 10, lesson: 'Cooking', location: 'Barnet', price: 35, spaces: 5, icon: 'https://cdn.pixabay.com/photo/2022/06/02/18/22/ramen-7238665_1280.jpg', synopsis: 'Discover culinary skills, recipes, and cooking techniques from various cuisines.' }
        ]
    },
    
    mounted() {
        this.fetchLessons();
    },
    
    computed: {
        cartCount() {
            return this.cart.reduce((total, item) => total + item.quantity, 0);
        },
        cartTotal() {
            return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        isNameValid() {
            return /^[a-zA-Z\s]+$/.test(this.checkoutName);
        },
        isPhoneValid() {
            return /^\d+$/.test(this.checkoutPhone);
        },
        isCheckoutEnabled() {
            return this.cart.length > 0 && this.isNameValid && this.isPhoneValid && this.checkoutName && this.checkoutPhone;
        },
        sortedLessons() {
            return [...this.lessons].sort((a, b) => {
                let comparison = 0;
                
                // Convert price and spaces to numbers for correct sorting
                const aValue = (this.sortBy === 'price' || this.sortBy === 'spaces') ? Number(a[this.sortBy]) : a[this.sortBy];
                const bValue = (this.sortBy === 'price' || this.sortBy === 'spaces') ? Number(b[this.sortBy]) : b[this.sortBy];

                if (aValue > bValue) {
                    comparison = 1;
                } else if (aValue < bValue) {
                    comparison = -1;
                }
                
                return this.sortOrder === 'asc' ? comparison : comparison * -1;
            });
        }
    },
    
    methods: {
        async fetchLessons() {
            try {
                // Corrected API call: apiBaseUrl already includes /api
                const response = await fetch(`${this.apiBaseUrl}/lessons`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Map the data to ensure consistency and use the correct MongoDB _id
                this.lessons = data.map(lesson => ({
                    // FIX: Use the correct 'id' field returned by the fixed backend
                    id: lesson.id, 
                    lesson: lesson.lesson,
                    location: lesson.location,
                    price: Number(lesson.price),
                    spaces: Number(lesson.spaces),
                    icon: lesson.icon,
                    synopsis: lesson.synopsis
                }));
                
            } catch (error) {
                console.error("Error fetching lessons:", error);
                // Fallback to local lessons if API fails
                this.lessons = this.fallbackLessons.map(lesson => ({
                    ...lesson,
                    // IMPORTANT: When using fallback, we must use the numeric ID.
                    // The backend validation will fail if a user tries to checkout
                    // with a fallback lesson, but this prevents the app from crashing.
                    // The user must fix the backend for full functionality.
                    id: lesson.id
                }));
            }
        },
        
        addToCart(lesson) {
            const cartItem = this.cart.find(item => item.id === lesson.id);
            
            if (lesson.spaces > 0) {
                if (cartItem) {
                    cartItem.quantity++;
                } else {
                    this.cart.push({
                        id: lesson.id,
                        lesson: lesson.lesson, // FIX: Use lesson.lesson instead of lesson.topic
                        location: lesson.location,
                        price: lesson.price,
                        quantity: 1
                    });
                }
                // Optimistically update spaces in the frontend
                lesson.spaces--;
            }
        },
        
        removeFromCart(item) {
            const lesson = this.lessons.find(l => l.id === item.id);
            
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                this.cart = this.cart.filter(cartItem => cartItem.id !== item.id);
            }
            
            // Optimistically update spaces in the frontend
            if (lesson) {
                lesson.spaces++;
            }
        },
        
        viewCart() {
            this.showCartPage = true;
            this.showOrderConfirmation = false; // Ensure confirmation is hidden when viewing cart
        },
        
        backToLessons() {
            this.showCartPage = false;
            this.showOrderConfirmation = false; // Ensure confirmation is hidden when going back
        },
        
        showLessonInfo(lesson) {
            this.selectedLesson = lesson;
            this.showLessonModal = true;
        },
        
        hideLessonInfo() {
            this.showLessonModal = false;
            this.selectedLesson = null;
        },
        
        async updateLessonSpaces() {
            for (const item of this.cart) {
                const lessonId = item.id;
                const spacesToReduce = item.quantity;
                
                try {
                    // Corrected API call: apiBaseUrl already includes /api
                    const response = await fetch(`${this.apiBaseUrl}/lessons/${lessonId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ spaces: spacesToReduce })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Failed to update spaces for lesson ${lessonId}`);
                    }
                    
                } catch (error) {
                    console.error(error);
                    // Handle error (e.g., show a message to the user)
                }
            }
        },
        
        async saveOrder() {
            const orderData = {
                name: this.checkoutName,
                phone: this.checkoutPhone,
                items: this.cart.map(item => ({
                    lessonId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: this.cartTotal
            };
            
            try {
                // Corrected API call: apiBaseUrl already includes /api
                const response = await fetch(`${this.apiBaseUrl}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    // Display the specific error message from the server
                    alert(`There was an error processing your order. Please try again.\n\nError: ${errorData.message || response.statusText}`);
                    return null;
                }
                
                return await response.json();
                
            } catch (error) {
                console.error("Error saving order:", error);
                alert("An unexpected error occurred while saving your order.");
                return null;
            }
        },
        
        async checkout() {
            if (!this.isCheckoutEnabled) {
                alert("Please fill in all fields correctly before checking out.");
                return;
            }
            
            // 1. Update lesson spaces in the database
            await this.updateLessonSpaces();
            
            // 2. Save the order to the database
            const savedOrder = await this.saveOrder();
            
            if (!savedOrder) {
                // Order failed to save (error message already shown in saveOrder)
                return;
            }
            
            // FIX: State Management for Confirmation Message
            
            // 3. Take a snapshot of the cart for the confirmation message
            const cartItemsSnapshot = [...this.cart];
            
            // 4. Generate order number
            const orderNumber = savedOrder._id || savedOrder.order?._id || 'ORD' + Date.now();
            
            // 5. Store confirmation details using the snapshot
            this.confirmedOrderDetails = {
                orderNumber: orderNumber,
                name: this.checkoutName,
                phone: this.checkoutPhone,
                items: cartItemsSnapshot, // Use the snapshot
                total: this.cartTotal
            };
            
            // 6. Clear form data and cart (must be done after snapshot)
            this.cart = [];
            this.checkoutName = '';
            this.checkoutPhone = '';
            
            // 7. Show confirmation message and hide cart page immediately
            this.showOrderConfirmation = true;
            this.showCartPage = false;
            
            console.log('Order completed successfully!');
            
            // 8. Refresh lessons from backend to get updated spaces
            this.fetchLessons();
            
            // 9. Set a timeout to hide the confirmation message after 9 seconds
            setTimeout(() => {
                this.showOrderConfirmation = false;
            }, 9000);
        }
    }
});
