// Interview Practice Logic

const interviewPractice = {
    state: {
        role: '',
        level: '',
        questions: [],
        currentQuestionIndex: 0,
        answers: [],
        isRecording: false,
        recordingStartTime: null,
        recordingTimer: null,
        recognition: null,
        currentTranscript: '',
        currentAnswer: ''
    },

    init() {
        this.setupEventListeners();
        this.loadSavedSession();
    },

    loadSavedSession() {
        const saved = utils.loadFromStorage('interview_session');
        if (saved && saved.questions && saved.questions.length > 0) {
            if (confirm('You have an incomplete interview session. Would you like to continue?')) {
                this.state = saved;
                this.resumeSession();
            }
        }
    },

    saveSession() {
        utils.saveToStorage('interview_session', this.state);
    },

    setupEventListeners() {
        // Role selection
        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const role = e.currentTarget.getAttribute('data-role');
                this.selectRole(role, e.currentTarget);
            });
        });

        // Level selection
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = e.currentTarget.getAttribute('data-level');
                this.selectLevel(level, e.currentTarget);
            });
        });

        // Start interview
        document.getElementById('start-interview')?.addEventListener('click', () => this.startInterview());

        // Recording controls
        document.getElementById('start-recording')?.addEventListener('click', () => this.startRecording());
        document.getElementById('stop-recording')?.addEventListener('click', () => this.stopRecording());

        // Toggle text input
        document.getElementById('toggle-text-input')?.addEventListener('click', () => this.toggleTextInput());

        // Submit answer
        document.getElementById('submit-answer')?.addEventListener('click', () => this.submitAnswer());
        document.getElementById('skip-question')?.addEventListener('click', () => this.skipQuestion());

        // Feedback controls
        document.getElementById('speak-feedback')?.addEventListener('click', () => this.speakFeedback());
        document.getElementById('stop-speaking')?.addEventListener('click', () => this.stopSpeaking());
        document.getElementById('next-question')?.addEventListener('click', () => this.nextQuestion());

        // Follow-up
        document.getElementById('answer-followup')?.addEventListener('click', () => this.answerFollowup());
        document.getElementById('skip-followup')?.addEventListener('click', () => this.skipFollowup());

        // Summary actions
        document.getElementById('retry-weak')?.addEventListener('click', () => this.retryWeakQuestions());
        document.getElementById('download-summary')?.addEventListener('click', () => this.downloadSummary());
        document.getElementById('start-new')?.addEventListener('click', () => this.startNewInterview());
    },

    selectRole(role, button) {
        this.state.role = role;

        // Update UI
        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.classList.remove('border-navy', 'bg-blue-50');
        });
        button.classList.add('border-navy', 'bg-blue-50');

        this.checkCanStart();
    },

    selectLevel(level, button) {
        this.state.level = level;

        // Update UI
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('border-navy', 'bg-blue-50');
        });
        button.classList.add('border-navy', 'bg-blue-50');

        this.checkCanStart();
    },

    checkCanStart() {
        const startBtn = document.getElementById('start-interview');
        if (this.state.role && this.state.level) {
            startBtn.disabled = false;
            startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    },

    async startInterview() {
        utils.showToast('Generating interview questions...', 'info');

        // Generate questions
        const questions = await this.generateQuestions();

        if (!questions || questions.length === 0) {
            utils.showToast('Failed to generate questions. Please try again.', 'error');
            return;
        }

        this.state.questions = questions;
        this.state.currentQuestionIndex = 0;
        this.state.answers = [];

        // Hide setup, show question
        document.getElementById('setup-step').classList.add('hidden');
        document.getElementById('question-step').classList.remove('hidden');

        // Update total questions
        document.getElementById('total-questions').textContent = questions.length;

        this.showQuestion();
        this.saveSession();
    },

    async generateQuestions() {
        const { role, level } = this.state;

        // Build AI prompt for question generation
        const prompt = `Generate 7 realistic interview questions for a ${role} position at the ${level} level in California K-12 education.

IMPORTANT CONSTRAINTS:
- Generate ONLY commonly-asked, standard interview questions for this role
- Do NOT create unusual, creative, or uncommon questions
- Base questions on typical hiring practices in California K-12 schools
- Questions should be realistic and commonly used by school districts
- Avoid overly specific or niche topics

Include a mix of:
- 2 behavioral questions (using "Tell me about a time...")
- 2 leadership philosophy questions
- 2 scenario-based questions
- 1 data/improvement question

Each question should be standard for ${role} education leadership interviews. Return ONLY the questions, numbered 1-7, one per line. No additional commentary.`;

        try {
            const response = await utils.askOllama(prompt);

            // Parse questions from response
            const questions = response
                .split('\n')
                .filter(line => line.trim() && /^\d+[.)]\s/.test(line.trim()))
                .map(line => line.replace(/^\d+[.)]\s*/, '').trim())
                .filter(q => q.length > 20);

            if (questions.length >= 5) {
                utils.showToast('AI-generated questions ready!', 'success');
                return questions.slice(0, 7); // Use first 7 questions
            } else {
                throw new Error('Insufficient questions generated');
            }
        } catch (error) {
            console.error('Question generation error:', error);
            utils.showToast('Using curated questions', 'info');
            return this.getFallbackQuestions(role);
        }
    },

    getFallbackQuestions(role) {
        const fallbacks = {
            'Principal': [
                'Describe your leadership philosophy and how it guides your decision-making as a principal.',
                'Tell me about a time when you had to implement a significant change at your school. How did you approach it?',
                'How would you handle a situation where a teacher is consistently underperforming despite coaching?',
                'Describe your approach to building positive relationships with families and the community.',
                'How do you use data to drive instructional improvements in your school?',
                'Tell me about a time when you had to manage a crisis or emergency situation.',
                'How do you support and develop teachers in your building?'
            ],
            'Vice-Principal': [
                'Describe your experience with student discipline and behavior management.',
                'How do you support teachers in improving their instructional practice?',
                'Tell me about a time when you had to mediate a conflict between staff members.',
                'How would you approach coordinating a school-wide initiative or program?',
                'Describe your experience with special education and IEP processes.',
                'How do you balance administrative duties with instructional leadership?',
                'Tell me about a time when you had to make a difficult decision regarding student safety.'
            ],
            'Superintendent': [
                'Describe your vision for leading a school district and ensuring equitable outcomes for all students.',
                'How do you build and maintain productive relationships with the school board?',
                'Tell me about your experience managing large budgets and making difficult financial decisions.',
                'How would you approach district-wide strategic planning and implementation?',
                'Describe a time when you led systemic change across multiple schools or departments.',
                'How do you engage families, community stakeholders, and partners in the district\'s work?',
                'What is your approach to recruiting, developing, and retaining high-quality principals and staff?'
            ]
        };

        return fallbacks[role] || fallbacks['Principal'];
    },

    showQuestion() {
        const question = this.state.questions[this.state.currentQuestionIndex];
        const questionNum = this.state.currentQuestionIndex + 1;

        // Update UI
        document.getElementById('question-number').textContent = questionNum;
        document.getElementById('current-question-text').textContent = question;
        document.getElementById('current-question').textContent = questionNum;

        // Update progress
        const percent = Math.round((questionNum / this.state.questions.length) * 100);
        document.getElementById('progress-percent').textContent = `${percent}%`;
        document.getElementById('interview-progress-bar').style.width = `${percent}%`;

        // Reset answer state
        this.state.currentTranscript = '';
        this.state.currentAnswer = '';
        document.getElementById('answer-transcript').textContent = '';
        document.getElementById('answer-text').value = '';
        document.getElementById('transcript-section').classList.add('hidden');
        document.getElementById('text-input-section').classList.add('hidden');
        document.getElementById('submit-answer').disabled = true;

        // Reset recording UI
        document.getElementById('recording-status').textContent = 'Click the microphone to start recording';
        document.getElementById('recording-time').textContent = '00:00';
        document.getElementById('confidence-indicator').textContent = '';
    },

    startRecording() {
        if (this.state.isRecording) return;

        // Setup speech recognition
        this.state.recognition = utils.setupSpeechRecognition(
            (transcript, confidence) => this.handleTranscript(transcript, confidence),
            (error) => this.handleRecordingError(error)
        );

        if (!this.state.recognition) return;

        this.state.recognition.start();
        this.state.isRecording = true;
        this.state.recordingStartTime = Date.now();
        this.state.currentTranscript = '';

        // Update UI
        document.getElementById('start-recording').disabled = true;
        document.getElementById('stop-recording').disabled = false;
        document.getElementById('stop-recording').classList.remove('bg-gray-400');
        document.getElementById('stop-recording').classList.add('bg-red-500', 'hover:bg-red-600');
        document.getElementById('recording-ring').classList.remove('hidden');
        document.getElementById('recording-status').textContent = 'Recording... Speak clearly';
        document.getElementById('recording-status').classList.add('recording-indicator', 'text-red-500');

        // Start timer
        this.startRecordingTimer();

        // Auto-stop after 60 seconds
        setTimeout(() => {
            if (this.state.isRecording) {
                this.stopRecording();
                utils.showToast('Maximum recording time reached', 'warning');
            }
        }, 60000);
    },

    stopRecording() {
        if (!this.state.isRecording) return;

        if (this.state.recognition) {
            this.state.recognition.stop();
        }

        this.state.isRecording = false;
        clearInterval(this.state.recordingTimer);

        // Update UI
        document.getElementById('start-recording').disabled = false;
        document.getElementById('stop-recording').disabled = true;
        document.getElementById('stop-recording').classList.add('bg-gray-400');
        document.getElementById('stop-recording').classList.remove('bg-red-500', 'hover:bg-red-600');
        document.getElementById('recording-ring').classList.add('hidden');
        document.getElementById('recording-status').textContent = 'Recording stopped';
        document.getElementById('recording-status').classList.remove('recording-indicator', 'text-red-500');

        // Show transcript and enable submit
        if (this.state.currentTranscript) {
            this.state.currentAnswer = this.state.currentTranscript;
            document.getElementById('answer-transcript').textContent = this.state.currentTranscript;
            document.getElementById('transcript-section').classList.remove('hidden');
            document.getElementById('submit-answer').disabled = false;
        }
    },

    startRecordingTimer() {
        this.state.recordingTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.state.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('recording-time').textContent =
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    },

    handleTranscript(transcript, confidence) {
        this.state.currentTranscript = transcript;

        // Show confidence indicator
        let confidenceText = '';
        let confidenceClass = '';

        if (confidence > 0.8) {
            confidenceText = '✓ High confidence';
            confidenceClass = 'text-green-500';
        } else if (confidence > 0.6) {
            confidenceText = '~ Medium confidence';
            confidenceClass = 'text-yellow-500';
        } else {
            confidenceText = '⚠ Low confidence - speak more clearly';
            confidenceClass = 'text-red-500';
        }

        const indicator = document.getElementById('confidence-indicator');
        indicator.textContent = confidenceText;
        indicator.className = `text-xs font-medium mt-1 ${confidenceClass}`;
    },

    handleRecordingError(error) {
        console.error('Recording error:', error);
        this.stopRecording();

        if (error === 'not-allowed') {
            utils.showToast('Microphone access denied. Please enable it in your browser settings.', 'error');
        } else {
            utils.showToast('Recording error. Try typing instead.', 'error');
        }
    },

    toggleTextInput() {
        const textSection = document.getElementById('text-input-section');
        const isHidden = textSection.classList.contains('hidden');

        if (isHidden) {
            textSection.classList.remove('hidden');
            document.getElementById('toggle-text-input').innerHTML = '<i class="fas fa-microphone mr-1"></i>Use voice instead?';

            // Monitor text input
            const textArea = document.getElementById('answer-text');
            textArea.addEventListener('input', () => {
                this.state.currentAnswer = textArea.value.trim();
                document.getElementById('submit-answer').disabled = !this.state.currentAnswer;
            });
        } else {
            textSection.classList.add('hidden');
            document.getElementById('toggle-text-input').innerHTML = '<i class="fas fa-keyboard mr-1"></i>Prefer to type instead?';
        }
    },

    async submitAnswer() {
        if (!this.state.currentAnswer) {
            utils.showToast('Please provide an answer first', 'warning');
            return;
        }

        // Hide question step, show loading
        document.getElementById('question-step').classList.add('hidden');
        utils.showToast('Analyzing your answer...', 'info');

        // Get AI feedback
        const feedback = await this.getAIFeedback();

        // Show feedback step
        this.displayFeedback(feedback);
        document.getElementById('feedback-step').classList.remove('hidden');

        // Save answer
        this.state.answers.push({
            question: this.state.questions[this.state.currentQuestionIndex],
            answer: this.state.currentAnswer,
            feedback: feedback.text,
            score: feedback.score,
            followup: feedback.followup
        });

        this.saveSession();
    },

    skipQuestion() {
        if (confirm('Skip this question? You won\'t receive feedback for it.')) {
            this.state.answers.push({
                question: this.state.questions[this.state.currentQuestionIndex],
                answer: '[Skipped]',
                feedback: 'Question skipped',
                score: 0,
                followup: null
            });

            this.nextQuestion();
        }
    },

    async getAIFeedback() {
        const question = this.state.questions[this.state.currentQuestionIndex];
        const answer = this.state.currentAnswer;
        const { role } = this.state;

        // Build comprehensive AI prompt for feedback
        const prompt = `You are an expert education leadership interview coach. Evaluate this answer to an interview question for a ${role} position.

QUESTION: "${question}"

CANDIDATE'S ANSWER: "${answer}"

Provide your evaluation in this EXACT format:

SCORE: [number from 1-10]

FEEDBACK:
[2-3 sentences of specific, factual feedback based ONLY on what the candidate actually said in their answer. Do not make assumptions or suggest things they didn't mention.]

SUGGESTIONS:
• [specific suggestion 1 - based only on what they said]
• [specific suggestion 2 - based only on what they said]
• [specific suggestion 3 - based only on what they said]

FOLLOWUP:
[Generate one relevant follow-up question that directly relates to something specific they mentioned in their answer]

IMPORTANT CONSTRAINTS:
- Base your evaluation ONLY on the actual content of their answer
- Do not invent or assume experiences they didn't mention
- Do not suggest accomplishments or metrics they didn't state
- Focus on structure, clarity, and completeness of their actual response
- Be factual and objective, not creative

Evaluation criteria:
- Use of STAR method (Situation, Task, Action, Result)
- Specific examples and concrete details THEY PROVIDED
- Leadership qualities THEY DEMONSTRATED in their answer
- Quantifiable results THEY MENTIONED
- Relevance to K-12 education leadership
- Clarity and communication`;

        try {
            const response = await utils.askOllama(prompt);

            // Parse the structured response
            const scoreMatch = response.match(/SCORE:\s*(\d+)/i);
            const feedbackMatch = response.match(/FEEDBACK:\s*([\s\S]*?)(?=SUGGESTIONS:|$)/i);
            const suggestionsMatch = response.match(/SUGGESTIONS:\s*([\s\S]*?)(?=FOLLOWUP:|$)/i);
            const followupMatch = response.match(/FOLLOWUP:\s*([\s\S]*?)$/i);

            const score = scoreMatch ? Math.min(10, Math.max(1, parseInt(scoreMatch[1]))) : 5;
            const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Your answer has been reviewed.';
            const suggestions = suggestionsMatch ? suggestionsMatch[1].trim() : '';
            const followup = followupMatch ? followupMatch[1].trim() : null;

            return {
                score: score,
                text: feedback,
                suggestions: suggestions,
                followup: followup
            };

        } catch (error) {
            console.error('AI feedback error:', error);

            // If AI fails, provide basic analysis
            const wordCount = answer.trim().split(/\s+/).length;
            const hasSTAR = /situation|task|action|result/i.test(answer.toLowerCase());
            const hasMetrics = /\d+%|\d+ students|\d+ teachers|\d+ years/i.test(answer);

            let score = wordCount > 100 ? 7 : wordCount > 50 ? 6 : 5;
            if (hasSTAR) score += 1;
            if (hasMetrics) score += 1;
            score = Math.min(score, 10);

            return {
                score: score,
                text: `Good effort! Your answer demonstrates understanding of the question. Consider using the STAR method (Situation, Task, Action, Result) and including specific examples with measurable outcomes to strengthen your response.`,
                suggestions: `• Structure your answer using STAR method\n• Include specific examples from your experience\n• Add quantifiable results and metrics\n• Demonstrate leadership qualities more explicitly`,
                followup: `Can you provide a specific example of when you applied this in your role?`
            };
        }
    },

    displayFeedback(feedback) {
        // Update score badge
        const scoreBadge = document.getElementById('score-badge');
        scoreBadge.textContent = `${feedback.score}/10`;

        // Update feedback content
        const feedbackContent = document.getElementById('feedback-content');
        feedbackContent.innerHTML = `
            <div class="bg-blue-50 border-2 border-navy-light rounded-lg p-6">
                <h3 class="font-bold text-lg text-navy mb-2">
                    <i class="fas fa-comment mr-2"></i>Overall Feedback
                </h3>
                <p class="text-gray-700 leading-relaxed">${utils.formatAIResponse(feedback.text)}</p>
            </div>

            ${feedback.suggestions ? `
                <div class="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                    <h3 class="font-bold text-lg text-navy mb-2">
                        <i class="fas fa-lightbulb mr-2"></i>Suggestions for Improvement
                    </h3>
                    <div class="text-gray-700 leading-relaxed">${utils.formatAIResponse(feedback.suggestions)}</div>
                </div>
            ` : ''}
        `;

        // Show follow-up if available
        if (feedback.followup) {
            document.getElementById('followup-question').textContent = feedback.followup;
            document.getElementById('followup-section').classList.remove('hidden');
        } else {
            document.getElementById('followup-section').classList.add('hidden');
        }
    },

    speakFeedback() {
        const feedback = this.state.answers[this.state.answers.length - 1].feedback;
        const score = this.state.answers[this.state.answers.length - 1].score;

        const textToSpeak = `Your score is ${score} out of 10. ${feedback}`;

        utils.speak(textToSpeak);

        document.getElementById('speak-feedback').classList.add('hidden');
        document.getElementById('stop-speaking').classList.remove('hidden');
    },

    stopSpeaking() {
        utils.stopSpeaking();
        document.getElementById('speak-feedback').classList.remove('hidden');
        document.getElementById('stop-speaking').classList.add('hidden');
    },

    answerFollowup() {
        // Hide followup section, show answer input
        document.getElementById('followup-section').classList.add('hidden');

        // Update question text
        const followupQuestion = document.getElementById('followup-question').textContent;
        document.getElementById('current-question-text').textContent = followupQuestion;

        // Show question step again
        document.getElementById('feedback-step').classList.add('hidden');
        document.getElementById('question-step').classList.remove('hidden');

        // Reset answer state
        this.state.currentAnswer = '';
        this.state.currentTranscript = '';
        document.getElementById('answer-transcript').textContent = '';
        document.getElementById('transcript-section').classList.add('hidden');
    },

    skipFollowup() {
        this.nextQuestion();
    },

    nextQuestion() {
        this.state.currentQuestionIndex++;

        // Check if interview is complete
        if (this.state.currentQuestionIndex >= this.state.questions.length) {
            this.showSummary();
            return;
        }

        // Show next question
        document.getElementById('feedback-step').classList.add('hidden');
        document.getElementById('question-step').classList.remove('hidden');
        this.showQuestion();
    },

    showSummary() {
        // Hide feedback step
        document.getElementById('feedback-step').classList.add('hidden');

        // Calculate overall score
        const totalScore = this.state.answers.reduce((sum, a) => sum + a.score, 0);
        const avgScore = (totalScore / this.state.answers.length).toFixed(1);

        document.getElementById('overall-score').textContent = avgScore;

        // Build summary table
        const summaryTable = document.getElementById('summary-table');
        summaryTable.innerHTML = this.state.answers.map((answer, i) => {
            const scoreClass = answer.score >= 7 ? 'text-green-600' : answer.score >= 5 ? 'text-yellow-600' : 'text-red-600';

            return `
                <tr class="${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
                    <td class="border border-gray-300 px-4 py-2 font-bold">${i + 1}</td>
                    <td class="border border-gray-300 px-4 py-2">${answer.question.substring(0, 80)}${answer.question.length > 80 ? '...' : ''}</td>
                    <td class="border border-gray-300 px-4 py-2 text-center font-bold ${scoreClass}">${answer.score}/10</td>
                    <td class="border border-gray-300 px-4 py-2 text-sm">${answer.feedback.substring(0, 100)}${answer.feedback.length > 100 ? '...' : ''}</td>
                </tr>
            `;
        }).join('');

        // Generate overall tips
        this.generateOverallTips(avgScore);

        // Show summary step
        document.getElementById('summary-step').classList.remove('hidden');

        // Clear saved session
        localStorage.removeItem('interview_session');
    },

    generateOverallTips(avgScore) {
        const tipsContainer = document.getElementById('overall-tips');

        let tips = [];

        if (avgScore < 6) {
            tips = [
                '• Focus on using the STAR method (Situation, Task, Action, Result) for behavioral questions',
                '• Provide specific examples from your experience rather than general statements',
                '• Take time to structure your thoughts before answering',
                '• Include measurable outcomes and data in your responses when possible'
            ];
        } else if (avgScore < 8) {
            tips = [
                '• Continue using the STAR method and add more specific metrics',
                '• Demonstrate deeper reflection on leadership challenges',
                '• Connect your experiences to education leadership best practices',
                '• Practice articulating your educational philosophy more clearly'
            ];
        } else {
            tips = [
                '• Excellent work! You\'re demonstrating strong interview skills',
                '• Continue refining your responses with even more specific examples',
                '• Practice responding to unexpected or challenging follow-up questions',
                '• Consider how to connect your experiences to the specific school/district context'
            ];
        }

        // Add common tips
        tips.push('• Practice out loud to improve fluency and confidence');
        tips.push('• Research the school/district before the interview');

        tipsContainer.innerHTML = tips.map(tip => `<p>${tip}</p>`).join('');
    },

    retryWeakQuestions() {
        // Get questions with score < 7
        const weakAnswers = this.state.answers.filter(a => a.score < 7);

        if (weakAnswers.length === 0) {
            utils.showToast('No questions with low scores to retry!', 'success');
            return;
        }

        if (confirm(`Retry ${weakAnswers.length} question(s) with scores below 7?`)) {
            // Reset state with weak questions
            this.state.questions = weakAnswers.map(a => a.question);
            this.state.currentQuestionIndex = 0;
            this.state.answers = [];

            // Show question step
            document.getElementById('summary-step').classList.add('hidden');
            document.getElementById('question-step').classList.remove('hidden');

            this.showQuestion();
            this.saveSession();
        }
    },

    downloadSummary() {
        // Create simple text summary
        let summary = `Interview Practice Summary\n`;
        summary += `Role: ${this.state.role}\n`;
        summary += `Level: ${this.state.level}\n`;
        summary += `Date: ${new Date().toLocaleDateString()}\n`;
        summary += `\n${'='.repeat(50)}\n\n`;

        const totalScore = this.state.answers.reduce((sum, a) => sum + a.score, 0);
        const avgScore = (totalScore / this.state.answers.length).toFixed(1);
        summary += `Overall Score: ${avgScore}/10\n\n`;

        this.state.answers.forEach((answer, i) => {
            summary += `Question ${i + 1}: ${answer.question}\n`;
            summary += `Your Answer: ${answer.answer}\n`;
            summary += `Score: ${answer.score}/10\n`;
            summary += `Feedback: ${answer.feedback}\n`;
            summary += `\n${'-'.repeat(50)}\n\n`;
        });

        // Download as text file
        const blob = new Blob([summary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Interview_Summary_${this.state.role}_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        utils.showToast('Summary downloaded!', 'success');
    },

    startNewInterview() {
        if (confirm('Start a new interview session? Current progress will be saved.')) {
            // Reset state
            this.state = {
                role: '',
                level: '',
                questions: [],
                currentQuestionIndex: 0,
                answers: [],
                isRecording: false,
                recordingStartTime: null,
                recordingTimer: null,
                recognition: null,
                currentTranscript: '',
                currentAnswer: ''
            };

            // Reset UI
            document.querySelectorAll('.role-btn, .level-btn').forEach(btn => {
                btn.classList.remove('border-navy', 'bg-blue-50');
            });

            // Show setup step
            document.getElementById('summary-step').classList.add('hidden');
            document.getElementById('setup-step').classList.remove('hidden');

            // Reset start button
            const startBtn = document.getElementById('start-interview');
            startBtn.disabled = true;
            startBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    },

    resumeSession() {
        // Show question step
        document.getElementById('setup-step').classList.add('hidden');
        document.getElementById('question-step').classList.remove('hidden');

        this.showQuestion();
        utils.showToast('Session resumed!', 'success');
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => interviewPractice.init());
} else {
    interviewPractice.init();
}
