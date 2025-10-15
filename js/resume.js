// Resume Builder Logic

const resumeBuilder = {
    data: {
        template: '',
        personal: {},
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certifications: []
    },

    templates: {
        principal: {
            title: 'Principal',
            summary: 'Experienced educational leader with 10+ years driving academic excellence and fostering inclusive school communities. Proven track record of implementing innovative curriculum strategies, developing high-performing teaching teams, and building strong partnerships with families and community stakeholders.',
            experience: [{
                title: 'Principal',
                organization: 'Lincoln High School',
                location: 'Los Angeles, CA',
                startDate: '2018',
                endDate: 'Present',
                bullets: [
                    'Led school of 1,200+ students to achieve 25% increase in standardized test scores over 3 years',
                    'Implemented data-driven instructional strategies resulting in 15% improvement in graduation rates',
                    'Developed and managed $3M annual budget while maintaining fiscal responsibility',
                    'Cultivated positive school culture through restorative justice practices, reducing disciplinary incidents by 30%'
                ]
            }],
            education: [{
                degree: 'Ed.D. in Educational Leadership',
                institution: 'University of California',
                location: 'Los Angeles, CA',
                year: '2015'
            }],
            skills: ['Curriculum Development', 'Budget Management', 'Team Leadership', 'Data Analysis', 'Community Engagement', 'Strategic Planning', 'Staff Development', 'Parent Communication'],
            certifications: [{
                name: 'Administrative Services Credential',
                issuer: 'California Commission on Teacher Credentialing',
                year: '2016'
            }]
        },
        'vice-principal': {
            title: 'Vice-Principal',
            summary: 'Dynamic education administrator with 8+ years of experience supporting school operations and student success. Skilled in instructional leadership, student discipline, and collaborative problem-solving. Committed to creating equitable learning environments where all students thrive.',
            experience: [{
                title: 'Assistant Principal',
                organization: 'Washington Middle School',
                location: 'San Diego, CA',
                startDate: '2019',
                endDate: 'Present',
                bullets: [
                    'Supervised instructional programs for 800+ students across grades 6-8',
                    'Coordinated professional development for 50+ teachers, focusing on differentiated instruction',
                    'Managed student discipline and behavioral interventions, implementing positive behavior support systems',
                    'Led school safety initiatives and crisis response protocols'
                ]
            }],
            education: [{
                degree: 'M.A. in Educational Administration',
                institution: 'San Diego State University',
                location: 'San Diego, CA',
                year: '2017'
            }],
            skills: ['Instructional Leadership', 'Student Discipline', 'Teacher Evaluation', 'Crisis Management', 'IEP Coordination', 'Parent Relations', 'School Safety', 'Professional Development'],
            certifications: [{
                name: 'Administrative Services Credential',
                issuer: 'California Commission on Teacher Credentialing',
                year: '2018'
            }]
        },
        superintendent: {
            title: 'Superintendent',
            summary: 'Visionary education executive with 15+ years of leadership experience transforming school districts. Expert in strategic planning, policy development, and stakeholder engagement. Proven ability to drive systemic change while ensuring equitable outcomes for all students.',
            experience: [{
                title: 'Superintendent',
                organization: 'Unified School District',
                location: 'Sacramento, CA',
                startDate: '2020',
                endDate: 'Present',
                bullets: [
                    'Led district of 12,000+ students, overseeing 15 schools and 1,000+ staff members',
                    'Developed and executed 5-year strategic plan focused on equity, innovation, and academic excellence',
                    'Managed $150M annual budget with transparent fiscal stewardship',
                    'Strengthened board relations and community partnerships through effective communication and collaboration',
                    'Championed diversity, equity, and inclusion initiatives resulting in improved outcomes for underserved students'
                ]
            }],
            education: [{
                degree: 'Ed.D. in Educational Leadership',
                institution: 'Stanford University',
                location: 'Stanford, CA',
                year: '2012'
            }],
            skills: ['Strategic Planning', 'Policy Development', 'Board Relations', 'Budget Management', 'Equity & Inclusion', 'Change Management', 'Community Engagement', 'Organizational Leadership', 'Data-Driven Decision Making'],
            certifications: [{
                name: 'Superintendent Credential',
                issuer: 'California Commission on Teacher Credentialing',
                year: '2019'
            }]
        }
    },

    init() {
        this.loadSavedData();
        this.setupEventListeners();
        this.setupAutoSave();
        this.updatePreview();
    },

    loadSavedData() {
        const saved = utils.loadFromStorage('resume_data');
        if (saved) {
            this.data = saved;
            this.populateForm();
            utils.showToast('Loaded saved resume', 'success');
        }
    },

    setupEventListeners() {
        // Template selection
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const template = e.currentTarget.getAttribute('data-template');
                this.loadTemplate(template);
            });
        });

        // Personal information
        ['fullName', 'title', 'email', 'phone', 'location'].forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('input', () => this.updatePersonal(field, input.value));
            }
        });

        // Summary
        const summaryField = document.getElementById('summary');
        if (summaryField) {
            summaryField.addEventListener('input', () => {
                this.data.summary = summaryField.value;
                this.updatePreview();
            });
        }

        // AI Suggestions
        document.getElementById('suggest-summary')?.addEventListener('click', () => this.suggestSummary());
        document.getElementById('suggest-skills')?.addEventListener('click', () => this.suggestSkills());

        // Add buttons
        document.getElementById('add-experience')?.addEventListener('click', () => this.addExperience());
        document.getElementById('add-education')?.addEventListener('click', () => this.addEducation());
        document.getElementById('add-certification')?.addEventListener('click', () => this.addCertification());
        document.getElementById('add-skill')?.addEventListener('click', () => this.addSkill());

        // Skill input enter key
        document.getElementById('skill-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addSkill();
        });

        // Save/Load/Clear
        document.getElementById('save-resume')?.addEventListener('click', () => this.saveResume());
        document.getElementById('clear-resume')?.addEventListener('click', () => this.clearResume());
        document.getElementById('download-pdf')?.addEventListener('click', () => this.downloadPDF());
    },

    setupAutoSave() {
        utils.setupAutoSave('resume_data', () => this.data, 30000);
    },

    loadTemplate(templateName) {
        const template = this.templates[templateName];
        if (!template) return;

        // Confirm if user has existing data
        if (this.hasData() && !confirm('Loading a template will replace your current data. Continue?')) {
            return;
        }

        this.data.template = templateName;
        this.data.personal.title = template.title;
        this.data.summary = template.summary;
        this.data.experience = template.experience;
        this.data.education = template.education;
        this.data.skills = template.skills;
        this.data.certifications = template.certifications;

        this.populateForm();
        this.updatePreview();

        utils.showToast(`${template.title} template loaded!`, 'success');

        // Highlight selected template
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.classList.remove('border-navy', 'bg-blue-50');
        });
        document.querySelector(`[data-template="${templateName}"]`)?.classList.add('border-navy', 'bg-blue-50');
    },

    hasData() {
        return this.data.personal.fullName ||
               this.data.summary ||
               this.data.experience.length > 0 ||
               this.data.education.length > 0 ||
               this.data.skills.length > 0;
    },

    populateForm() {
        // Personal info
        const fields = ['fullName', 'title', 'email', 'phone', 'location'];
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input && this.data.personal[field]) {
                input.value = this.data.personal[field];
            }
        });

        // Summary
        const summaryField = document.getElementById('summary');
        if (summaryField && this.data.summary) {
            summaryField.value = this.data.summary;
        }

        // Experience
        this.data.experience.forEach(exp => this.renderExperience(exp));

        // Education
        this.data.education.forEach(edu => this.renderEducation(edu));

        // Skills
        this.data.skills.forEach(skill => this.renderSkill(skill));

        // Certifications
        this.data.certifications.forEach(cert => this.renderCertification(cert));

        this.updateProgress();
    },

    updatePersonal(field, value) {
        this.data.personal[field] = value;
        this.updatePreview();
        this.updateProgress();
    },

    addExperience() {
        const exp = {
            id: utils.generateId(),
            title: '',
            organization: '',
            location: '',
            startDate: '',
            endDate: '',
            bullets: ['']
        };
        this.data.experience.push(exp);
        this.renderExperience(exp);
        this.updatePreview();
    },

    renderExperience(exp) {
        const container = document.getElementById('experience-list');
        const div = document.createElement('div');
        div.className = 'border-2 border-gray-300 rounded-lg p-4 space-y-3';
        div.setAttribute('data-id', exp.id);

        div.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <i class="fas fa-grip-vertical text-gray-400 cursor-move"></i>
                <button class="remove-exp text-red-500 hover:text-red-700 transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="grid md:grid-cols-2 gap-3">
                <input type="text" class="exp-title px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="Job Title" value="${exp.title || ''}">
                <input type="text" class="exp-org px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="Organization" value="${exp.organization || ''}">
            </div>
            <div class="grid md:grid-cols-3 gap-3">
                <input type="text" class="exp-location px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="Location" value="${exp.location || ''}">
                <input type="text" class="exp-start px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="Start (2020)" value="${exp.startDate || ''}">
                <input type="text" class="exp-end px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="End (Present)" value="${exp.endDate || ''}">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Key Achievements:</label>
                <div class="bullets-container space-y-2">
                    ${exp.bullets.map((bullet, i) => `
                        <div class="flex gap-2">
                            <input type="text" class="bullet-input flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="• Achievement or responsibility" value="${bullet}" data-index="${i}">
                            ${exp.bullets.length > 1 ? `<button class="remove-bullet text-red-500 hover:text-red-700" data-index="${i}"><i class="fas fa-times"></i></button>` : ''}
                        </div>
                    `).join('')}
                </div>
                <button class="add-bullet bg-navy-light text-white px-3 py-1 rounded text-sm hover:bg-navy transition-colors">
                    <i class="fas fa-plus mr-1"></i>Add Bullet
                </button>
                <button class="suggest-bullets bg-gold text-white px-3 py-1 rounded text-sm hover:brightness-110 transition-all">
                    <i class="fas fa-magic mr-1"></i>AI Suggest
                </button>
            </div>
        `;

        container.appendChild(div);

        // Event listeners
        div.querySelector('.exp-title').addEventListener('input', (e) => this.updateExperienceField(exp.id, 'title', e.target.value));
        div.querySelector('.exp-org').addEventListener('input', (e) => this.updateExperienceField(exp.id, 'organization', e.target.value));
        div.querySelector('.exp-location').addEventListener('input', (e) => this.updateExperienceField(exp.id, 'location', e.target.value));
        div.querySelector('.exp-start').addEventListener('input', (e) => this.updateExperienceField(exp.id, 'startDate', e.target.value));
        div.querySelector('.exp-end').addEventListener('input', (e) => this.updateExperienceField(exp.id, 'endDate', e.target.value));

        div.querySelectorAll('.bullet-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.updateBullet(exp.id, index, e.target.value);
            });
        });

        div.querySelector('.add-bullet').addEventListener('click', () => this.addBullet(exp.id, div));
        div.querySelector('.suggest-bullets').addEventListener('click', () => this.suggestBullets(exp.id));
        div.querySelector('.remove-exp').addEventListener('click', () => this.removeExperience(exp.id, div));

        div.querySelectorAll('.remove-bullet').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.removeBullet(exp.id, index, div);
            });
        });

        // Setup drag-drop
        this.setupSortable('experience-list');
    },

    updateExperienceField(id, field, value) {
        const exp = this.data.experience.find(e => e.id === id);
        if (exp) {
            exp[field] = value;
            this.updatePreview();
        }
    },

    addBullet(expId, container) {
        const exp = this.data.experience.find(e => e.id === expId);
        if (exp) {
            exp.bullets.push('');
            // Re-render the experience to show new bullet
            const oldDiv = container;
            oldDiv.remove();
            this.renderExperience(exp);
            this.updatePreview();
        }
    },

    removeBullet(expId, index, container) {
        const exp = this.data.experience.find(e => e.id === expId);
        if (exp && exp.bullets.length > 1) {
            exp.bullets.splice(index, 1);
            const oldDiv = container;
            oldDiv.remove();
            this.renderExperience(exp);
            this.updatePreview();
        }
    },

    updateBullet(expId, index, value) {
        const exp = this.data.experience.find(e => e.id === expId);
        if (exp && exp.bullets[index] !== undefined) {
            exp.bullets[index] = value;
            this.updatePreview();
        }
    },

    removeExperience(id, element) {
        if (confirm('Remove this experience?')) {
            this.data.experience = this.data.experience.filter(e => e.id !== id);
            element.remove();
            this.updatePreview();
        }
    },

    async suggestBullets(expId) {
        const exp = this.data.experience.find(e => e.id === expId);
        if (!exp || !exp.title) {
            utils.showToast('Please enter a job title first', 'warning');
            return;
        }

        utils.showToast('Getting AI suggestions...', 'info');

        const prompt = `Suggest 4-5 strong bullet points for a ${exp.title} position in K-12 education leadership. Focus on:
- Leadership and management achievements
- Data-driven results with metrics
- Team development and collaboration
- Student outcomes and improvements

Role: ${exp.title}
Organization: ${exp.organization || 'School'}

Format as a numbered list. Use action verbs like "Led", "Implemented", "Developed", "Achieved". Include specific numbers where appropriate.`;

        const response = await utils.askOllama(prompt);

        // Parse bullets from response
        const bullets = response.split('\n').filter(line => line.trim() && /^\d+[\.\)]/.test(line.trim()))
            .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim());

        if (bullets.length > 0) {
            exp.bullets = bullets;
            // Re-render
            const element = document.querySelector(`[data-id="${expId}"]`);
            element.remove();
            this.renderExperience(exp);
            this.updatePreview();
            utils.showToast('AI suggestions added!', 'success');
        } else {
            utils.showToast('Could not generate suggestions', 'error');
        }
    },

    addEducation() {
        const edu = {
            id: utils.generateId(),
            degree: '',
            institution: '',
            location: '',
            year: ''
        };
        this.data.education.push(edu);
        this.renderEducation(edu);
        this.updatePreview();
    },

    renderEducation(edu) {
        const container = document.getElementById('education-list');
        const div = document.createElement('div');
        div.className = 'border-2 border-gray-300 rounded-lg p-4 space-y-3';
        div.setAttribute('data-id', edu.id);

        div.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <i class="fas fa-grip-vertical text-gray-400 cursor-move"></i>
                <button class="remove-edu text-red-500 hover:text-red-700 transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <input type="text" class="edu-degree w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="Degree (e.g., Ed.D. in Educational Leadership)" value="${edu.degree || ''}">
            <div class="grid md:grid-cols-2 gap-3">
                <input type="text" class="edu-institution px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="Institution" value="${edu.institution || ''}">
                <input type="text" class="edu-location px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="Location" value="${edu.location || ''}">
            </div>
            <input type="text" class="edu-year w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="Year (2020)" value="${edu.year || ''}">
        `;

        container.appendChild(div);

        // Event listeners
        div.querySelector('.edu-degree').addEventListener('input', (e) => this.updateEducationField(edu.id, 'degree', e.target.value));
        div.querySelector('.edu-institution').addEventListener('input', (e) => this.updateEducationField(edu.id, 'institution', e.target.value));
        div.querySelector('.edu-location').addEventListener('input', (e) => this.updateEducationField(edu.id, 'location', e.target.value));
        div.querySelector('.edu-year').addEventListener('input', (e) => this.updateEducationField(edu.id, 'year', e.target.value));
        div.querySelector('.remove-edu').addEventListener('click', () => this.removeEducation(edu.id, div));

        this.setupSortable('education-list');
    },

    updateEducationField(id, field, value) {
        const edu = this.data.education.find(e => e.id === id);
        if (edu) {
            edu[field] = value;
            this.updatePreview();
        }
    },

    removeEducation(id, element) {
        if (confirm('Remove this education entry?')) {
            this.data.education = this.data.education.filter(e => e.id !== id);
            element.remove();
            this.updatePreview();
        }
    },

    addSkill() {
        const input = document.getElementById('skill-input');
        const skill = input.value.trim();

        if (!skill) return;

        if (!this.data.skills.includes(skill)) {
            this.data.skills.push(skill);
            this.renderSkill(skill);
            this.updatePreview();
        }

        input.value = '';
    },

    renderSkill(skill) {
        const container = document.getElementById('skills-container');

        const chip = document.createElement('div');
        chip.className = 'bg-navy text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:bg-navy-light transition-colors';
        chip.innerHTML = `
            <span>${utils.sanitizeHTML(skill)}</span>
            <button class="remove-skill hover:text-red-300 transition-colors">
                <i class="fas fa-times"></i>
            </button>
        `;

        chip.querySelector('.remove-skill').addEventListener('click', () => {
            this.data.skills = this.data.skills.filter(s => s !== skill);
            chip.remove();
            this.updatePreview();
        });

        container.appendChild(chip);
    },

    async suggestSkills() {
        utils.showToast('Getting AI skill suggestions...', 'info');

        const role = this.data.personal.title || this.data.template || 'education leader';

        const prompt = `Suggest 8-10 key skills for a ${role} in K-12 education. Include a mix of:
- Leadership and management skills
- Technical and instructional skills
- Interpersonal and communication skills

Format as a simple comma-separated list. Be specific and relevant to education leadership.`;

        const response = await utils.askOllama(prompt);

        // Parse skills
        const skills = response.split(/[,\n]/).map(s => s.trim().replace(/^[-•*]\s*/, ''))
            .filter(s => s && s.length > 2 && s.length < 50)
            .slice(0, 10);

        if (skills.length > 0) {
            // Show as suggestions
            const container = document.getElementById('skills-container');
            const suggestDiv = document.createElement('div');
            suggestDiv.className = 'w-full bg-blue-50 border-2 border-navy-light rounded-lg p-4 mb-2';
            suggestDiv.innerHTML = `
                <p class="font-medium text-navy mb-2"><i class="fas fa-magic mr-2"></i>AI Suggestions (click to add):</p>
                <div class="flex flex-wrap gap-2">
                    ${skills.map(skill => `
                        <button class="suggestion-chip bg-white text-navy border-2 border-navy px-3 py-1 rounded-full hover:bg-navy hover:text-white transition-all text-sm" data-skill="${utils.sanitizeHTML(skill)}">
                            ${utils.sanitizeHTML(skill)}
                        </button>
                    `).join('')}
                </div>
            `;

            // Remove old suggestions
            container.querySelector('.bg-blue-50')?.remove();

            container.insertBefore(suggestDiv, container.firstChild);

            // Add click handlers
            suggestDiv.querySelectorAll('.suggestion-chip').forEach(btn => {
                btn.addEventListener('click', () => {
                    const skill = btn.getAttribute('data-skill');
                    if (!this.data.skills.includes(skill)) {
                        this.data.skills.push(skill);
                        this.renderSkill(skill);
                        this.updatePreview();
                    }
                    btn.remove();
                });
            });

            utils.showToast('Click suggestions to add them!', 'success');
        }
    },

    async suggestSummary() {
        utils.showToast('Generating AI summary...', 'info');

        const role = this.data.personal.title || this.data.template || 'education leader';
        const experience = this.data.experience[0];

        const prompt = `Write a professional summary (3-5 sentences) for a ${role} resume in K-12 education. Include:
- Years of experience
- Key leadership strengths
- Focus on student outcomes and equity
- Professional goals

${experience ? `Current role: ${experience.title} at ${experience.organization}` : ''}

Make it compelling and achievement-focused. Use action-oriented language.`;

        const response = await utils.askOllama(prompt);

        if (response && !response.includes('error')) {
            const summaryField = document.getElementById('summary');
            summaryField.value = response.replace(/<br>/g, '\n');
            this.data.summary = response;
            this.updatePreview();
            utils.showToast('Summary generated!', 'success');
        }
    },

    addCertification() {
        const cert = {
            id: utils.generateId(),
            name: '',
            issuer: '',
            year: ''
        };
        this.data.certifications.push(cert);
        this.renderCertification(cert);
        this.updatePreview();
    },

    renderCertification(cert) {
        const container = document.getElementById('certification-list');
        const div = document.createElement('div');
        div.className = 'border-2 border-gray-300 rounded-lg p-4 space-y-3';
        div.setAttribute('data-id', cert.id);

        div.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <i class="fas fa-grip-vertical text-gray-400 cursor-move"></i>
                <button class="remove-cert text-red-500 hover:text-red-700 transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <input type="text" class="cert-name w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="Certification Name" value="${cert.name || ''}">
            <div class="grid md:grid-cols-2 gap-3">
                <input type="text" class="cert-issuer px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="Issuing Organization" value="${cert.issuer || ''}">
                <input type="text" class="cert-year px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy" placeholder="Year" value="${cert.year || ''}">
            </div>
        `;

        container.appendChild(div);

        // Event listeners
        div.querySelector('.cert-name').addEventListener('input', (e) => this.updateCertificationField(cert.id, 'name', e.target.value));
        div.querySelector('.cert-issuer').addEventListener('input', (e) => this.updateCertificationField(cert.id, 'issuer', e.target.value));
        div.querySelector('.cert-year').addEventListener('input', (e) => this.updateCertificationField(cert.id, 'year', e.target.value));
        div.querySelector('.remove-cert').addEventListener('click', () => this.removeCertification(cert.id, div));

        this.setupSortable('certification-list');
    },

    updateCertificationField(id, field, value) {
        const cert = this.data.certifications.find(c => c.id === id);
        if (cert) {
            cert[field] = value;
            this.updatePreview();
        }
    },

    removeCertification(id, element) {
        if (confirm('Remove this certification?')) {
            this.data.certifications = this.data.certifications.filter(c => c.id !== id);
            element.remove();
            this.updatePreview();
        }
    },

    setupSortable(containerId) {
        const container = document.getElementById(containerId);
        if (container && !container.sortableInstance) {
            container.sortableInstance = Sortable.create(container, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                handle: '.fa-grip-vertical',
                onEnd: () => {
                    // Update data order based on DOM order
                    if (containerId === 'experience-list') {
                        const newOrder = Array.from(container.children).map(el =>
                            this.data.experience.find(e => e.id === el.getAttribute('data-id'))
                        ).filter(Boolean);
                        this.data.experience = newOrder;
                    } else if (containerId === 'education-list') {
                        const newOrder = Array.from(container.children).map(el =>
                            this.data.education.find(e => e.id === el.getAttribute('data-id'))
                        ).filter(Boolean);
                        this.data.education = newOrder;
                    } else if (containerId === 'certification-list') {
                        const newOrder = Array.from(container.children).map(el =>
                            this.data.certifications.find(c => c.id === el.getAttribute('data-id'))
                        ).filter(Boolean);
                        this.data.certifications = newOrder;
                    }
                    this.updatePreview();
                }
            });
        }
    },

    updatePreview() {
        const preview = document.getElementById('resume-preview');
        const { personal, summary, experience, education, skills, certifications } = this.data;

        // Check if we have any data
        if (!personal.fullName && !summary && experience.length === 0) {
            preview.innerHTML = `
                <div class="text-center text-gray-400 py-20">
                    <i class="fas fa-file-alt text-6xl mb-4"></i>
                    <p>Fill in your information to see the preview</p>
                </div>
            `;
            return;
        }

        // Build preview HTML
        let html = '';

        // Header
        html += `
            <div class="text-center mb-6 border-b-4 border-navy pb-4">
                <h1 class="text-3xl font-bold text-navy mb-2">${personal.fullName || '[Your Name]'}</h1>
                <p class="text-lg text-gray-700 font-medium mb-2">${personal.title || '[Your Title]'}</p>
                <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    ${personal.email ? `<span><i class="fas fa-envelope mr-1"></i>${personal.email}</span>` : ''}
                    ${personal.phone ? `<span><i class="fas fa-phone mr-1"></i>${personal.phone}</span>` : ''}
                    ${personal.location ? `<span><i class="fas fa-map-marker-alt mr-1"></i>${personal.location}</span>` : ''}
                </div>
            </div>
        `;

        // Summary
        if (summary) {
            html += `
                <div class="preview-section mb-6">
                    <h2 class="text-xl font-bold text-navy mb-3 border-b-2 border-gray-300 pb-1">PROFESSIONAL SUMMARY</h2>
                    <p class="text-gray-700 leading-relaxed">${summary.replace(/\n/g, '<br>')}</p>
                </div>
            `;
        }

        // Experience
        if (experience.length > 0) {
            html += `
                <div class="preview-section mb-6">
                    <h2 class="text-xl font-bold text-navy mb-3 border-b-2 border-gray-300 pb-1">PROFESSIONAL EXPERIENCE</h2>
                    <div class="space-y-4">
                        ${experience.map(exp => `
                            <div>
                                <div class="flex justify-between items-start mb-1">
                                    <h3 class="font-bold text-lg">${exp.title || '[Title]'}</h3>
                                    <span class="text-sm text-gray-600">${exp.startDate || '[Start]'} - ${exp.endDate || '[End]'}</span>
                                </div>
                                <p class="text-gray-700 font-medium mb-2">${exp.organization || '[Organization]'}${exp.location ? ` | ${exp.location}` : ''}</p>
                                ${exp.bullets && exp.bullets.length > 0 ? `
                                    <ul class="list-none space-y-1 ml-4">
                                        ${exp.bullets.filter(b => b.trim()).map(bullet => `
                                            <li class="text-gray-700 leading-relaxed">• ${bullet}</li>
                                        `).join('')}
                                    </ul>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Education
        if (education.length > 0) {
            html += `
                <div class="preview-section mb-6">
                    <h2 class="text-xl font-bold text-navy mb-3 border-b-2 border-gray-300 pb-1">EDUCATION</h2>
                    <div class="space-y-3">
                        ${education.map(edu => `
                            <div>
                                <div class="flex justify-between items-start">
                                    <h3 class="font-bold">${edu.degree || '[Degree]'}</h3>
                                    <span class="text-sm text-gray-600">${edu.year || '[Year]'}</span>
                                </div>
                                <p class="text-gray-700">${edu.institution || '[Institution]'}${edu.location ? ` | ${edu.location}` : ''}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Skills
        if (skills.length > 0) {
            html += `
                <div class="preview-section mb-6">
                    <h2 class="text-xl font-bold text-navy mb-3 border-b-2 border-gray-300 pb-1">KEY SKILLS</h2>
                    <div class="flex flex-wrap gap-2">
                        ${skills.map(skill => `
                            <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">${skill}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Certifications
        if (certifications.length > 0) {
            html += `
                <div class="preview-section mb-6">
                    <h2 class="text-xl font-bold text-navy mb-3 border-b-2 border-gray-300 pb-1">CERTIFICATIONS</h2>
                    <div class="space-y-2">
                        ${certifications.map(cert => `
                            <div class="flex justify-between">
                                <p class="font-medium">${cert.name || '[Certification]'}</p>
                                <span class="text-sm text-gray-600">${cert.year || '[Year]'}</span>
                            </div>
                            ${cert.issuer ? `<p class="text-sm text-gray-600">${cert.issuer}</p>` : ''}
                        `).join('')}
                    </div>
                </div>
            `;
        }

        preview.innerHTML = html;
        this.updateProgress();
    },

    updateProgress() {
        // Calculate completion percentage
        let completed = 0;
        let total = 7;

        if (this.data.personal.fullName) completed++;
        if (this.data.personal.email) completed++;
        if (this.data.summary) completed++;
        if (this.data.experience.length > 0) completed++;
        if (this.data.education.length > 0) completed++;
        if (this.data.skills.length > 0) completed++;
        if (this.data.certifications.length > 0) completed++;

        const percentage = Math.round((completed / total) * 100);

        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${percentage}%`;
    },

    saveResume() {
        if (utils.saveToStorage('resume_data', this.data)) {
            utils.showToast('Resume saved successfully!', 'success');
        }
    },

    clearResume() {
        if (confirm('Are you sure you want to clear all resume data? This cannot be undone.')) {
            this.data = {
                template: '',
                personal: {},
                summary: '',
                experience: [],
                education: [],
                skills: [],
                certifications: []
            };

            // Clear form
            document.querySelectorAll('input, textarea').forEach(input => input.value = '');
            document.getElementById('experience-list').innerHTML = '';
            document.getElementById('education-list').innerHTML = '';
            document.getElementById('skills-container').innerHTML = '';
            document.getElementById('certification-list').innerHTML = '';

            this.updatePreview();
            utils.saveToStorage('resume_data', this.data);
            utils.showToast('Resume cleared', 'success');
        }
    },

    downloadPDF() {
        const { jsPDF } = window.jspdf;

        if (!jsPDF) {
            utils.showToast('PDF library not loaded', 'error');
            return;
        }

        const doc = new jsPDF();
        const { personal, summary, experience, education, skills, certifications } = this.data;

        let y = 20; // Current Y position

        // Helper to add text with wrapping
        const addText = (text, x, maxWidth, fontSize = 10) => {
            doc.setFontSize(fontSize);
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, y);
            y += lines.length * (fontSize * 0.5) + 2;
        };

        // Header
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(30, 58, 138); // Navy
        doc.text(personal.fullName || 'Your Name', 105, y, { align: 'center' });
        y += 8;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(personal.title || 'Your Title', 105, y, { align: 'center' });
        y += 6;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const contact = [personal.email, personal.phone, personal.location].filter(Boolean).join(' | ');
        doc.text(contact, 105, y, { align: 'center' });
        y += 10;

        // Summary
        if (summary) {
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('PROFESSIONAL SUMMARY', 20, y);
            y += 6;
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            addText(summary, 20, 170, 10);
            y += 5;
        }

        // Experience
        if (experience.length > 0) {
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('PROFESSIONAL EXPERIENCE', 20, y);
            y += 6;

            experience.forEach(exp => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }

                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(exp.title || '[Title]', 20, y);
                doc.setFont(undefined, 'normal');
                doc.text(`${exp.startDate || '[Start]'} - ${exp.endDate || '[End]'}`, 190, y, { align: 'right' });
                y += 5;

                doc.setFontSize(10);
                doc.text(`${exp.organization || '[Organization]'}${exp.location ? ' | ' + exp.location : ''}`, 20, y);
                y += 5;

                if (exp.bullets) {
                    exp.bullets.filter(b => b.trim()).forEach(bullet => {
                        if (y > 270) {
                            doc.addPage();
                            y = 20;
                        }
                        addText(`• ${bullet}`, 25, 165, 10);
                    });
                }

                y += 3;
            });
        }

        // Education (add new page if needed)
        if (education.length > 0) {
            if (y > 250) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('EDUCATION', 20, y);
            y += 6;

            education.forEach(edu => {
                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(edu.degree || '[Degree]', 20, y);
                doc.setFont(undefined, 'normal');
                doc.text(edu.year || '[Year]', 190, y, { align: 'right' });
                y += 5;

                doc.setFontSize(10);
                doc.text(`${edu.institution || '[Institution]'}${edu.location ? ' | ' + edu.location : ''}`, 20, y);
                y += 6;
            });
        }

        // Skills
        if (skills.length > 0) {
            if (y > 250) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('KEY SKILLS', 20, y);
            y += 6;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            const skillsText = skills.join(' • ');
            addText(skillsText, 20, 170, 10);
            y += 3;
        }

        // Certifications
        if (certifications.length > 0) {
            if (y > 250) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('CERTIFICATIONS', 20, y);
            y += 6;

            certifications.forEach(cert => {
                doc.setFontSize(10);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(cert.name || '[Certification]', 20, y);
                doc.setFont(undefined, 'normal');
                doc.text(cert.year || '[Year]', 190, y, { align: 'right' });
                y += 4;

                if (cert.issuer) {
                    doc.setFontSize(9);
                    doc.text(cert.issuer, 20, y);
                    y += 5;
                } else {
                    y += 3;
                }
            });
        }

        // Save the PDF
        const filename = `${personal.fullName || 'Resume'}_Resume.pdf`.replace(/\s+/g, '_');
        doc.save(filename);

        utils.showToast('PDF downloaded!', 'success');
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => resumeBuilder.init());
} else {
    resumeBuilder.init();
}
