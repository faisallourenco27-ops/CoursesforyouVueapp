new Vue({
    el: '#app',
    data: {
        sortBy: 'lesson',
        sortOrder: 'asc',
        cart: [],
        showCartPage: false,
        checkoutName: '',
        checkoutPhone: '',
        orderSubmitted: false,
        showOrderConfirmation: false,
        confirmedOrderDetails: null,
        showLessonModal: false,
        selectedLesson: null,
        apiBaseUrl: 'https://expressjs-flj.onrender.com/api',
        lessons: []
    },

    created() {
        this.fetchLessons();
    },

    computed: {
        sortedLessons() {
            const sorted = [...this.lessons].sort((a, b) => {
                let aValue = a[this.sortBy];
                let bValue = b[this.sortBy];
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }
                if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
            return sorted;
        },

        cartCount() {
            return this.cart.reduce((total, item) => total + item.quantity, 0);
        },
        
        isNameValid() {
            return /^[A-Za-z\s]+$/.test(this.checkoutName.trim());
        },
        
        isPhoneValid() {
            return /^\d+$/.test(this.checkoutPhone.trim());
        },
        
        isCheckoutEnabled() {
            return this.isNameValid && this.isPhoneValid && this.cart.length > 0;
        },
        
        cartTotal() {
            return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
    },
    
    methods: {
        async fetchLessons() {
            try {
                console.log('Fetching lessons from:', `${this.apiBaseUrl}/lessons`);
                const response = await fetch(`${this.apiBaseUrl}/lessons`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Received data:', data);
                
                this.lessons = data.map(lesson => ({
                    id: lesson._id,
                    lesson: lesson.topic,
                    location: lesson.location,
                    price: lesson.price,
                    spaces: lesson.space,
                    icon: this.getLessonImage(lesson.topic),
                    synopsis: `Learn ${lesson.topic} at our ${lesson.location} location. An engaging course designed to help you master the subject.`
                }));
                
                console.log('Lessons fetched successfully:', this.lessons.length, 'lessons');
                
            } catch (error) {
                console.error('Error fetching lessons:', error);
                // Use fallback lessons if API fails
                this.useFallbackLessons();
            }
        },

        useFallbackLessons() {
            this.lessons = [
                {
                    id: 1,
                    lesson: 'Further Maths',
                    location: 'Hendon',
                    price: 50,
                    spaces: 5,
                    icon: 'https://media.istockphoto.com/id/1866121335/photo/physics-and-mathematics.webp?b=1&s=612x612&w=0&k=20&c=ND9gyyqbrA8GknNpbo4-Oy9vVKzaSJ6P3L2JvqYTYO0=',
                    synopsis: 'An advanced course in mathematical concepts and techniques beyond standard curriculum.'
                },
                {
                    id: 2,
                    lesson: 'Art & Design',
                    location: 'Hendon',
                    price: 55,
                    spaces: 5,
                    icon: 'https://media.istockphoto.com/id/1372126412/photo/multiracial-students-painting-inside-art-room-class-at-school-focus-on-girl-face.webp?b=1&s=612x612&w=0&k=20&c=3KPEFUIEjH4IqegohqPiZmqieezUl4yMoLgHjhoxzQY=',
                    synopsis: 'Explore creativity through various mediums including painting, sculpture, and digital art.'
                }
            ];
        },

        getLessonImage(topic) {
            const imageMap = {
                'Further Maths': 'https://media.istockphoto.com/id/1866121335/photo/physics-and-mathematics.webp?b=1&s=612x612&w=0&k=20&c=ND9gyyqbrA8GknNpbo4-Oy9vVKzaSJ6P3L2JvqYTYO0=',
                'Art & Design': 'https://media.istockphoto.com/id/1372126412/photo/multiracial-students-painting-inside-art-room-class-at-school-focus-on-girl-face.webp?b=1&s=612x612&w=0&k=20&c=3KPEFUIEjH4IqegohqPiZmqieezUl4yMoLgHjhoxzQY=',
                'Boxing': 'https://cdn.pixabay.com/photo/2012/10/25/23/32/boxing-62867_1280.jpg',
                'Karate': 'https://cdn.pixabay.com/photo/2022/01/28/07/39/marshall-6973880_1280.jpg',
                'Football': 'https://cdn.pixabay.com/photo/2014/10/14/20/24/ball-488717_1280.jpg',
                'Drama': 'https://cdn.pixabay.com/photo/2022/07/30/01/18/actor-7352882_1280.jpg',
                'Music': 'https://cdn.pixabay.com/photo/2020/06/29/19/26/piano-5353974_1280.jpg',
                'Basketball': 'https://cdn.pixabay.com/photo/2017/10/29/21/06/tahincioglu-basketball-super-league-2900843_1280.jpg',
                'Coding': 'https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536_1280.jpg',
                'Cooking': 'https://cdn.pixabay.com/photo/2022/06/02/18/22/ramen-7238665_1280.jpg'
            };
            return imageMap[topic] || 'https://via.placeholder.com/220';
        },

        addToCart(lesson) {
            if (lesson.spaces > 0) {
                lesson.spaces--;
                const existingItem = this.cart.find(item => item.id === lesson.id);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    this.cart.push({
                        id: lesson.id,
                        lesson: lesson.lesson,
                        location: lesson.location,
                        price: lesson.price,
                        quantity: 1
                    });
                }
            }
        },
        
        removeFromCart(cartItem) {
            const lesson = this.lessons.find(l => l.id === cartItem.id);
            if (lesson) {
                lesson.spaces += cartItem.quantity;
            }
            this.cart = this.cart.filter(item => item.id !== cartItem.id);
        },
        
        viewCart() {
            this.showCartPage = true;
            this.orderSubmitted = false;
        },
        
        backToLessons() {
            this.showCartPage = false;
            this.showOrderConfirmation = false;
            this.checkoutName = '';
            this.checkoutPhone = '';
        },
       
        async saveOrder(orderData) {
            try {
                console.log('Sending order data:', orderData);
                
                // Try different data formats to see what the backend expects
                const orderPayload = {
                    name: orderData.name,
                    phone: orderData.phoneNumber, // Try 'phone' instead of 'phoneNumber'
                    lessons: orderData.lessonIDs.map(id => ({
                        id: id,
                        quantity: 1 // Default quantity
                    }))
                };
                
                console.log('Order payload:', orderPayload);
                
                const response = await fetch(`${this.apiBaseUrl}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderPayload)
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}. Response: ${errorText}`);
                }
                
                const savedOrder = await response.json();
                console.log('Order saved successfully:', savedOrder);
                return savedOrder;
                
            } catch (error) {
                console.error('Error saving order:', error);
                throw error;
            }
        },

        async updateLessonSpaces(lessonId, newSpaces) {
            try {
                console.log(`Updating lesson ${lessonId} to ${newSpaces} spaces`);
                
                const response = await fetch(`${this.apiBaseUrl}/lessons/${lessonId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ space: newSpaces })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const updatedLesson = await response.json();
                console.log('Lesson spaces updated:', updatedLesson);
                return updatedLesson;
                
            } catch (error) {
                console.error('Error updating lesson spaces:', error);
                throw error;
            }
        },

        async checkout() {
            if (!this.isCheckoutEnabled) return;
            
            try {
                console.log('Starting checkout process...');
                
                const cartSnapshot = [...this.cart];
                const totalSnapshot = this.cartTotal;
                const nameSnapshot = this.checkoutName;
                const phoneSnapshot = this.checkoutPhone;
                
                // Prepare order data - try simpler format
                const orderData = {
                    name: nameSnapshot,
                    phone: phoneSnapshot, // Changed from phoneNumber to phone
                    lessonIDs: cartSnapshot.map(item => item.id),
                    totalSpaces: cartSnapshot.reduce((total, item) => total + item.quantity, 0)
                };
                
                console.log('Order data being sent:', orderData);
                
                // B. POST - Save the order to database
                console.log('Saving order...');
                const savedOrder = await this.saveOrder(orderData);
                
                // C. PUT - Update spaces for each lesson in the cart
                console.log('Updating lesson spaces...');
                const updatePromises = cartSnapshot.map(item => {
                    const lesson = this.lessons.find(l => l.id === item.id);
                    if (lesson) {
                        return this.updateLessonSpaces(item.id, lesson.spaces);
                    }
                });
                
                await Promise.all(updatePromises.filter(p => p !== undefined));
                console.log('All lesson spaces updated');
                
                // Generate order number for display
                const orderNumber = savedOrder._id || savedOrder.orderId || 'ORD' + Date.now();
                
                // Store confirmation details using snapshots
                this.confirmedOrderDetails = {
                    orderNumber: orderNumber,
                    name: nameSnapshot,
                    phone: phoneSnapshot,
                    items: cartSnapshot,
                    total: totalSnapshot
                };
                
                console.log('Order confirmation details:', this.confirmedOrderDetails);
                
                // Show confirmation message
                this.showOrderConfirmation = true;
                
                // Clear form and cart
                this.cart = [];
                this.checkoutName = '';
                this.checkoutPhone = '';
                
                console.log('Checkout completed successfully!');
                
                // Hide confirmation and return to lessons after delay
                setTimeout(() => {
                    this.showOrderConfirmation = false;
                    this.showCartPage = false;
                    
                    // Refresh lessons from backend to get updated spaces
                    this.fetchLessons();
                }, 9000);
                
            } catch (error) {
                console.error('Checkout error:', error);
                
                // Show user-friendly error message
                if (error.message.includes('400')) {
                    alert('There was an error with your order data. Please check your information and try again.');
                } else {
                    alert('There was an error processing your order. Please try again.\n\nError: ' + error.message);
                }
            }
        },
       
        showLessonInfo(lesson) {
            this.selectedLesson = lesson;
            this.showLessonModal = true;
        },
    
        hideLessonInfo() {
            this.showLessonModal = false;
            this.selectedLesson = null;
        }
    }
});