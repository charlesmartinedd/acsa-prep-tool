// Resources Page Logic

const resourcesPage = {
    resources: [
        // Credentials & Licensing
        {
            id: 1,
            title: 'California Administrative Services Credential',
            description: 'Official information about the Administrative Services Credential required for K-12 leadership positions in California.',
            category: 'credentials',
            url: 'https://www.ctc.ca.gov/',
            icon: 'fa-certificate',
            color: 'navy'
        },
        {
            id: 2,
            title: 'Preliminary Administrative Services Credential Requirements',
            description: 'Detailed requirements, prerequisites, and program options for obtaining your preliminary credential.',
            category: 'credentials',
            url: 'https://www.ctc.ca.gov/',
            icon: 'fa-list-check',
            color: 'navy-light'
        },
        {
            id: 3,
            title: 'Clear Administrative Services Credential',
            description: 'Requirements for advancing from preliminary to clear credential, including induction programs.',
            category: 'credentials',
            url: 'https://www.ctc.ca.gov/',
            icon: 'fa-award',
            color: 'green-500'
        },

        // Professional Organizations
        {
            id: 4,
            title: 'ACSA - Association of California School Administrators',
            description: 'The premier professional association for California K-12 education leaders. Offers conferences, networking, and resources.',
            category: 'organizations',
            url: 'https://www.acsa.org/',
            icon: 'fa-users',
            color: 'gold'
        },
        {
            id: 5,
            title: 'CALSA - California Association of Latino Superintendents and Administrators',
            description: 'Professional organization focused on Latino education leaders and equity in California schools.',
            category: 'organizations',
            url: 'https://www.calsa.org/',
            icon: 'fa-hands-helping',
            color: 'purple-500'
        },
        {
            id: 6,
            title: 'NAESP - National Association of Elementary School Principals',
            description: 'National organization providing resources, professional development, and advocacy for elementary and middle school principals.',
            category: 'organizations',
            url: 'https://www.naesp.org/',
            icon: 'fa-school',
            color: 'blue-500'
        },

        // Leadership Development
        {
            id: 7,
            title: 'California School Leadership Academy',
            description: 'Professional learning programs for aspiring and current school leaders across California.',
            category: 'leadership',
            url: 'https://www.wested.org/',
            icon: 'fa-graduation-cap',
            color: 'navy'
        },
        {
            id: 8,
            title: 'Instructional Leadership Framework',
            description: 'Comprehensive framework for developing instructional leadership skills and practices.',
            category: 'leadership',
            url: 'https://www.cde.ca.gov/',
            icon: 'fa-chalkboard-teacher',
            color: 'teal-500'
        },
        {
            id: 9,
            title: 'Equity-Centered Leadership Resources',
            description: 'Tools and frameworks for leading with an equity lens and closing opportunity gaps.',
            category: 'leadership',
            url: 'https://www.edtrust.org/',
            icon: 'fa-balance-scale',
            color: 'red-500'
        },

        // Interview Prep
        {
            id: 10,
            title: 'Principal Interview Question Bank',
            description: 'Comprehensive collection of common principal interview questions with sample STAR responses.',
            category: 'interview',
            url: '#',
            icon: 'fa-question-circle',
            color: 'navy-light'
        },
        {
            id: 11,
            title: 'STAR Method Guide for Education Leaders',
            description: 'Detailed guide on using the STAR method (Situation, Task, Action, Result) for behavioral interview questions.',
            category: 'interview',
            url: '#',
            icon: 'fa-star',
            color: 'gold'
        },
        {
            id: 12,
            title: 'Virtual Interview Tips for Administrators',
            description: 'Best practices for succeeding in virtual/remote interview settings, including technology setup and presentation.',
            category: 'interview',
            url: '#',
            icon: 'fa-video',
            color: 'green-500'
        },

        // Books & Publications
        {
            id: 13,
            title: 'The Principal: Three Keys to Maximizing Impact',
            description: 'By Michael Fullan - Essential reading on effective school leadership and driving systemic change.',
            category: 'books',
            url: 'https://www.amazon.com/',
            icon: 'fa-book',
            color: 'indigo-500'
        },
        {
            id: 14,
            title: 'Instructional Leadership: A Research-Based Guide',
            description: 'By Sally J. Zepeda - Practical strategies for improving teaching and learning through leadership.',
            category: 'books',
            url: 'https://www.amazon.com/',
            icon: 'fa-book-open',
            color: 'indigo-500'
        },
        {
            id: 15,
            title: 'Leading for Equity: Becoming an Equity-Centered Leader',
            description: 'By Safir & Dugan - Framework for developing equity-centered leadership practices.',
            category: 'books',
            url: 'https://www.amazon.com/',
            icon: 'fa-book-reader',
            color: 'indigo-500'
        },
        {
            id: 16,
            title: 'Educational Leadership Journal',
            description: 'ASCD\'s flagship publication with research and practical articles for education leaders.',
            category: 'books',
            url: 'http://www.ascd.org/el',
            icon: 'fa-newspaper',
            color: 'gray-600'
        },

        // Additional Resources
        {
            id: 17,
            title: 'California Department of Education - Leadership Resources',
            description: 'Official CDE resources for school leaders, including policy guidance and best practices.',
            category: 'leadership',
            url: 'https://www.cde.ca.gov/',
            icon: 'fa-landmark',
            color: 'navy'
        },
        {
            id: 18,
            title: 'EdSource - California Education News',
            description: 'Comprehensive coverage of California K-12 education news, policy, and data.',
            category: 'leadership',
            url: 'https://edsource.org/',
            icon: 'fa-newspaper',
            color: 'blue-600'
        }
    ],

    filteredResources: [],

    init() {
        this.filteredResources = [...this.resources];
        this.renderResources();
        this.setupEventListeners();
        this.animateCards();
    },

    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const clearBtn = document.getElementById('clear-filters');

        // Search input with debounce
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => this.applyFilters(), 300);
        });

        // Category filter
        categoryFilter.addEventListener('change', () => this.applyFilters());

        // Clear filters
        clearBtn.addEventListener('click', () => this.clearFilters());
    },

    applyFilters() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const category = document.getElementById('category-filter').value;

        this.filteredResources = this.resources.filter(resource => {
            // Category filter
            const categoryMatch = category === 'all' || resource.category === category;

            // Search filter
            const searchMatch = !searchTerm ||
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                resource.category.toLowerCase().includes(searchTerm);

            return categoryMatch && searchMatch;
        });

        this.renderResources();
    },

    clearFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('category-filter').value = 'all';
        this.applyFilters();
    },

    renderResources() {
        const grid = document.getElementById('resources-grid');
        const noResults = document.getElementById('no-results');

        if (this.filteredResources.length === 0) {
            grid.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }

        grid.classList.remove('hidden');
        noResults.classList.add('hidden');

        grid.innerHTML = this.filteredResources.map(resource => this.createResourceCard(resource)).join('');

        // Add event listeners to cards
        document.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    const link = card.querySelector('a');
                    if (link) link.click();
                }
            });
        });
    },

    createResourceCard(resource) {
        const categoryLabels = {
            credentials: 'Credentials',
            leadership: 'Leadership',
            interview: 'Interview',
            organizations: 'Organizations',
            books: 'Books & Publications'
        };

        return `
            <div class="resource-card bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer fade-in">
                <div class="bg-gradient-to-r from-${resource.color} to-${resource.color} p-6 text-white">
                    <i class="fas ${resource.icon} text-5xl mb-3"></i>
                    <h3 class="text-xl font-bold leading-tight">${resource.title}</h3>
                </div>
                <div class="p-6">
                    <div class="mb-3">
                        <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                            ${categoryLabels[resource.category]}
                        </span>
                    </div>
                    <p class="text-gray-700 leading-relaxed mb-4">${resource.description}</p>
                    <a
                        href="${resource.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center text-${resource.color} hover:underline font-medium"
                    >
                        <span>Learn More</span>
                        <i class="fas fa-external-link-alt ml-2 text-sm"></i>
                    </a>
                </div>
            </div>
        `;
    },

    animateCards() {
        // Stagger animation for cards
        const cards = document.querySelectorAll('.resource-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 50);
        });
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => resourcesPage.init());
} else {
    resourcesPage.init();
}
