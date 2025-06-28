import pandas as pd
import numpy as np
import re
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import gensim
from gensim.models import Word2Vec
import warnings

warnings.filterwarnings('ignore')


class VietnameseChatbot:
    def __init__(self):
        self.stop_words = self._load_vietnamese_stopwords()
        self.vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
        self.nb_classifier = MultinomialNB(alpha=0.1)
        self.word2vec_model = None
        self.qa_data = None
        self.processed_questions = []
        self.answers = []

    def _load_vietnamese_stopwords(self):
        """Tải danh sách từ dừng tiếng Việt mở rộng"""
        vietnamese_stopwords = [
            # Từ dừng cơ bản
            'là', 'của', 'và', 'có', 'được', 'một', 'trong', 'không', 'với', 'để',
            'cho', 'từ', 'này', 'đó', 'các', 'những', 'khi', 'nếu', 'như', 'thì',
            'về', 'ra', 'vào', 'lên', 'xuống', 'đi', 'đến', 'tại', 'trên', 'dưới',
            'sau', 'trước', 'trong', 'ngoài', 'giữa', 'cùng', 'theo', 'qua', 'bằng',

            # Đại từ
            'tôi', 'bạn', 'anh', 'chị', 'em', 'mình', 'ta', 'chúng', 'họ', 'nó',
            'tao', 'mày', 'nó', 'chúng', 'mọi', 'ai', 'gì', 'đâu', 'nào', 'sao',

            # Từ nghi vấn
            'gì', 'ai', 'đâu', 'nào', 'sao', 'thế', 'như', 'thì', 'mà', 'rồi',
            'làm', 'sao', 'thế', 'nào', 'tại', 'vì',

            # Từ chỉ thời gian
            'đã', 'sẽ', 'đang', 'vẫn', 'còn', 'chỉ', 'cũng', 'đều', 'cả', 'mọi',
            'rồi', 'xong', 'chưa', 'đã', 'sắp', 'vừa', 'mới',

            # Liên từ
            'nhưng', 'mà', 'hay', 'hoặc', 'tuy', 'dù', 'dẫu', 'song', 'nhưng',
            'tuy', 'nhiên', 'vậy', 'nên', 'nếu', 'thì',

            # Trợ từ
            'thôi', 'nha', 'nhé', 'đấy', 'ấy', 'kia', 'đây', 'này', 'ở', 'tại'
        ]
        return set(vietnamese_stopwords)

    def tokenization(self, text):
        """Bước 1: Tokenization - Tách từ tiếng Việt"""
        # Xử lý các trường hợp đặc biệt
        text = re.sub(r'([.!?])', r' \1 ', text)  # Tách dấu câu
        text = re.sub(r'([,;:])', r' \1 ', text)  # Tách dấu phẩy, chấm phẩy
        text = re.sub(r'\s+', ' ', text)  # Loại bỏ khoảng trắng thừa

        tokens = text.split()

        # Loại bỏ các token chỉ chứa dấu câu
        tokens = [token for token in tokens if not re.match(r'^[^\w\s]+$', token)]

        return tokens

    def normalization(self, text):
        """Bước 2: Normalization - Chuẩn hóa văn bản tiếng Việt"""
        # Chuyển về chữ thường
        text = text.lower()

        # Loại bỏ dấu câu và ký tự đặc biệt (giữ lại chữ tiếng Việt)
        text = re.sub(r'[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]', ' ', text)

        # Loại bỏ số
        text = re.sub(r'\d+', '', text)

        # Loại bỏ khoảng trắng thừa
        text = re.sub(r'\s+', ' ', text).strip()

        return text

    def remove_stop_words(self, tokens):
        """Bước 3: Stop Words Removal - Loại bỏ từ dừng"""
        return [token for token in tokens if token.lower() not in self.stop_words and len(token) > 1]

    def structured_processing(self, text):
        """Bước 4: Structured Processing - Xử lý có cấu trúc"""
        # Chuẩn hóa
        normalized_text = self.normalization(text)

        # Tokenization
        tokens = self.tokenization(normalized_text)

        # Loại bỏ từ dừng
        filtered_tokens = self.remove_stop_words(tokens)

        # Ghép lại thành chuỗi
        processed_text = ' '.join(filtered_tokens)

        return processed_text, filtered_tokens

    def extract_features(self, texts):
        """Bước 5: Feature Extraction - Trích xuất đặc trưng"""
        # TF-IDF Features
        tfidf_features = self.vectorizer.fit_transform(texts)

        # Word2Vec Features (nếu có model)
        if self.word2vec_model:
            w2v_features = []
            for text in texts:
                words = text.split()
                word_vectors = []
                for word in words:
                    if word in self.word2vec_model.wv:
                        word_vectors.append(self.word2vec_model.wv[word])

                if word_vectors:
                    # Trung bình vector của các từ
                    text_vector = np.mean(word_vectors, axis=0)
                else:
                    # Vector zero nếu không có từ nào trong model
                    text_vector = np.zeros(self.word2vec_model.vector_size)

                w2v_features.append(text_vector)

            w2v_features = np.array(w2v_features)
            return tfidf_features, w2v_features

        return tfidf_features, None

    def build_word_embeddings(self, processed_texts):
        """Xây dựng Word Embeddings với Word2Vec"""
        # Chuẩn bị dữ liệu cho Word2Vec (list of list of words)
        sentences = [text.split() for text in processed_texts if text.strip()]

        if not sentences:
            print("No valid sentences for Word2Vec training")
            return

        # Huấn luyện Word2Vec model
        self.word2vec_model = Word2Vec(
            sentences=sentences,
            vector_size=100,
            window=5,
            min_count=1,
            workers=4,
            epochs=100
        )

        print(f"Word2Vec model trained with vocabulary size: {len(self.word2vec_model.wv)}")

    def load_data(self, file_paths):
        """Tải và xử lý dữ liệu từ các file CSV"""
        all_data = []

        for file_path in file_paths:
            try:
                if file_path.endswith('.csv'):
                    # Thử đọc với encoding khác nhau
                    for encoding in ['utf-8', 'utf-8-sig', 'cp1252', 'iso-8859-1']:
                        try:
                            df = pd.read_csv(file_path, encoding=encoding)
                            print(f"Successfully loaded {file_path} with encoding {encoding}")
                            break
                        except UnicodeDecodeError:
                            continue
                        except FileNotFoundError:
                            print(f"File not found: {file_path}")
                            break
                    else:
                        print(f"Could not read {file_path} with any encoding")
                        continue

                    # Xử lý các tên cột có thể có
                    if 'question' in df.columns and 'answer' in df.columns:
                        df = df.rename(columns={'question': 'questions', 'answer': 'answers'})
                    elif 'Question' in df.columns and 'Answer' in df.columns:
                        df = df.rename(columns={'Question': 'questions', 'Answer': 'answers'})

                    if 'questions' in df.columns and 'answers' in df.columns:
                        # Loại bỏ các hàng có giá trị null
                        df = df.dropna(subset=['questions', 'answers'])
                        all_data.append(df[['questions', 'answers']])
                    else:
                        print(f"Warning: {file_path} doesn't have expected columns")
                        print(f"Available columns: {df.columns.tolist()}")

            except Exception as e:
                print(f"Error loading {file_path}: {str(e)}")

        if all_data:
            self.qa_data = pd.concat(all_data, ignore_index=True)
            print(f"Total loaded data: {len(self.qa_data)} Q&A pairs")
            return True
        else:
            print("No data could be loaded. Creating sample data...")
            self.create_sample_data()
            return False

    def create_sample_data(self):
        """Tạo dữ liệu mẫu nếu không tải được file"""
        sample_data = {
            'questions': [
                'Thích mẫu người nào',
                'Có crush ai không',
                'Tại sao lại thích bạn đó',
                'Có hay nói chuyện không',
                'Bạn kia có bắt chuyện trước không',
                'Có định rủ bạn đó về quê dịp Tết không',
                'Học gì để giỏi toán',
                'Làm thế nào để học tiếng Anh tốt',
                'Cách ôn thi hiệu quả',
                'Học lập trình khó không',
                'Bạn sống ở đâu',
                'Sở thích của bạn là gì',
                'Bạn thích ăn gì',
                'Bạn thích nghe nhạc gì',
                'Công việc của bạn là gì'
            ],
            'answers': [
                'Dễ thương, tóc dài, da trắng',
                'Có 1 bạn cùng lớp',
                'Vì đáp ứng những yêu cầu của tôi',
                'Hay nhắn tin messenger',
                'Có đôi khi',
                'Có, đang đợi trả lời',
                'Nên làm nhiều bài tập và hiểu bản chất của các công thức',
                'Luyện nghe nói hàng ngày và đọc sách tiếng Anh',
                'Làm đề thi cũ và tóm tắt kiến thức theo chương',
                'Ban đầu khó nhưng với thời gian sẽ quen dần',
                'Tôi sống ở Hà Nội',
                'Tôi thích đọc sách và nghe nhạc',
                'Tôi thích ăn phở và bún chả',
                'Tôi thích nghe nhạc pop và rock',
                'Tôi là một lập trình viên'
            ]
        }
        self.qa_data = pd.DataFrame(sample_data)
        print("Sample data created successfully")

    def train(self):
        """Huấn luyện mô hình chatbot"""
        if self.qa_data is None or len(self.qa_data) == 0:
            print("No data available for training")
            return

        print("Starting training process...")

        # Bước 1-4: Tiền xử lý dữ liệu
        print("Step 1-4: Preprocessing data...")
        processed_questions = []
        processed_tokens_list = []

        for question in self.qa_data['questions']:
            if pd.notna(question):  # Kiểm tra null
                processed_text, tokens = self.structured_processing(str(question))
                processed_questions.append(processed_text)
                processed_tokens_list.append(tokens)

        if not processed_questions:
            print("No valid questions found after preprocessing")
            return

        self.processed_questions = processed_questions
        self.answers = [str(ans) for ans in self.qa_data['answers'][:len(processed_questions)].tolist()]

        # Bước 5: Xây dựng Word Embeddings
        print("Step 5: Building Word Embeddings...")
        self.build_word_embeddings(processed_questions)

        # Bước 6: Feature Extraction
        print("Step 6: Feature Extraction...")
        try:
            tfidf_features, w2v_features = self.extract_features(processed_questions)
        except Exception as e:
            print(f"Error in feature extraction: {e}")
            return

        # Bước 7: Huấn luyện Naive Bayes với TF-IDF
        print("Step 7: Training Naive Bayes classifier...")

        # Tạo labels cho classification (mỗi câu hỏi là một class)
        labels = list(range(len(processed_questions)))

        try:
            # Chia dữ liệu train/test
            if len(processed_questions) > 1:
                X_train, X_test, y_train, y_test = train_test_split(
                    tfidf_features, labels, test_size=0.2, random_state=42
                )

                # Huấn luyện
                self.nb_classifier.fit(X_train, y_train)

                # Đánh giá
                y_pred = self.nb_classifier.predict(X_test)
                accuracy = accuracy_score(y_test, y_pred)
                print(f"Model accuracy: {accuracy:.4f}")
            else:
                # Nếu chỉ có 1 sample thì train trên toàn bộ dữ liệu
                self.nb_classifier.fit(tfidf_features, labels)
                print("Model trained on full dataset (small dataset)")

            print("Training completed successfully!")
        except Exception as e:
            print(f"Error during training: {e}")

    def predict_answer(self, user_question, top_k=3):
        """Dự đoán câu trả lời cho câu hỏi của user"""
        if not self.processed_questions or not self.answers:
            return {
                'answer': 'Xin lỗi, tôi chưa được huấn luyện để trả lời câu hỏi này.',
                'confidence': 0.0,
                'question_matched': '',
                'similarity_scores': {}
            }

        # Tiền xử lý câu hỏi
        processed_question, _ = self.structured_processing(user_question)

        if not processed_question.strip():
            return {
                'answer': 'Xin lỗi, tôi không hiểu câu hỏi của bạn.',
                'confidence': 0.0,
                'question_matched': '',
                'similarity_scores': {}
            }

        try:
            # Vectorize câu hỏi
            question_tfidf = self.vectorizer.transform([processed_question])

            # Phương pháp 1: Sử dụng Naive Bayes classifier
            nb_probabilities = self.nb_classifier.predict_proba(question_tfidf)[0]
            nb_top_indices = np.argsort(nb_probabilities)[-top_k:][::-1]

            # Phương pháp 2: Sử dụng cosine similarity với TF-IDF
            processed_questions_tfidf = self.vectorizer.transform(self.processed_questions)
            tfidf_similarities = cosine_similarity(question_tfidf, processed_questions_tfidf)[0]
            tfidf_top_indices = np.argsort(tfidf_similarities)[-top_k:][::-1]

            # Phương pháp 3: Sử dụng Word2Vec similarity (nếu có)
            w2v_similarities = []
            if self.word2vec_model:
                question_words = processed_question.split()
                question_vector = self._get_text_vector(question_words)

                for proc_q in self.processed_questions:
                    proc_words = proc_q.split()
                    proc_vector = self._get_text_vector(proc_words)

                    if question_vector is not None and proc_vector is not None:
                        similarity = cosine_similarity([question_vector], [proc_vector])[0][0]
                    else:
                        similarity = 0

                    w2v_similarities.append(similarity)

                w2v_similarities = np.array(w2v_similarities)
                w2v_top_indices = np.argsort(w2v_similarities)[-top_k:][::-1]
            else:
                w2v_top_indices = tfidf_top_indices
                w2v_similarities = np.zeros(len(self.processed_questions))

            # Kết hợp các phương pháp (ensemble)
            ensemble_scores = {}

            # Điểm từ Naive Bayes
            for i, idx in enumerate(nb_top_indices):
                ensemble_scores[idx] = ensemble_scores.get(idx, 0) + (top_k - i) * 0.4

            # Điểm từ TF-IDF similarity
            for i, idx in enumerate(tfidf_top_indices):
                ensemble_scores[idx] = ensemble_scores.get(idx, 0) + (top_k - i) * 0.4

            # Điểm từ Word2Vec similarity
            for i, idx in enumerate(w2v_top_indices):
                ensemble_scores[idx] = ensemble_scores.get(idx, 0) + (top_k - i) * 0.2

            # Chọn câu trả lời tốt nhất
            if ensemble_scores:
                best_idx = max(ensemble_scores.keys(), key=lambda x: ensemble_scores[x])

                return {
                    'answer': self.answers[best_idx],
                    'confidence': ensemble_scores[best_idx] / (top_k * 1.0),
                    'question_matched': self.qa_data['questions'].iloc[best_idx],
                    'similarity_scores': {
                        'naive_bayes_prob': nb_probabilities[best_idx],
                        'tfidf_similarity': tfidf_similarities[best_idx],
                        'w2v_similarity': w2v_similarities[best_idx] if len(w2v_similarities) > best_idx else 0
                    }
                }
            else:
                return {
                    'answer': 'Xin lỗi, tôi không tìm thấy câu trả lời phù hợp.',
                    'confidence': 0.0,
                    'question_matched': '',
                    'similarity_scores': {}
                }

        except Exception as e:
            print(f"Error in prediction: {e}")
            return {
                'answer': 'Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn.',
                'confidence': 0.0,
                'question_matched': '',
                'similarity_scores': {}
            }

    def _get_text_vector(self, words):
        """Lấy vector trung bình của một đoạn text"""
        if not self.word2vec_model:
            return None

        word_vectors = []
        for word in words:
            if word in self.word2vec_model.wv:
                word_vectors.append(self.word2vec_model.wv[word])

        if word_vectors:
            return np.mean(word_vectors, axis=0)
        else:
            return np.zeros(self.word2vec_model.vector_size)

    def save_model(self, model_path='vietnamese_chatbot_model.pkl'):
        """Lưu mô hình"""
        try:
            model_data = {
                'vectorizer': self.vectorizer,
                'nb_classifier': self.nb_classifier,
                'word2vec_model': self.word2vec_model,
                'processed_questions': self.processed_questions,
                'answers': self.answers,
                'qa_data': self.qa_data,
                'stop_words': self.stop_words
            }

            with open(model_path, 'wb') as f:
                pickle.dump(model_data, f)
            print(f"Model saved to {model_path}")
        except Exception as e:
            print(f"Error saving model: {e}")

    def load_model(self, model_path='vietnamese_chatbot_model.pkl'):
        """Tải mô hình"""
        try:
            with open(model_path, 'rb') as f:
                model_data = pickle.load(f)

            self.vectorizer = model_data['vectorizer']
            self.nb_classifier = model_data['nb_classifier']
            self.word2vec_model = model_data['word2vec_model']
            self.processed_questions = model_data['processed_questions']
            self.answers = model_data['answers']
            self.qa_data = model_data['qa_data']
            self.stop_words = model_data['stop_words']

            print(f"Model loaded from {model_path}")
            return True
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False

    def add_qa_pair(self, question, answer):
        """Thêm cặp câu hỏi-trả lời mới"""
        if self.qa_data is None:
            self.qa_data = pd.DataFrame({'questions': [], 'answers': []})

        new_data = pd.DataFrame({'questions': [question], 'answers': [answer]})
        self.qa_data = pd.concat([self.qa_data, new_data], ignore_index=True)

        # Cập nhật processed_questions và answers
        processed_text, _ = self.structured_processing(question)
        self.processed_questions.append(processed_text)
        self.answers.append(answer)

        print(f"Added new Q&A pair: {question} -> {answer}")

    def get_stats(self):
        """Lấy thống kê về mô hình"""
        stats = {
            'total_qa_pairs': len(self.qa_data) if self.qa_data is not None else 0,
            'processed_questions': len(self.processed_questions),
            'vocabulary_size': len(self.word2vec_model.wv) if self.word2vec_model else 0,
            'tfidf_features': self.vectorizer.get_feature_names_out() if hasattr(self.vectorizer,
                                                                                 'get_feature_names_out') else []
        }
        return stats


# Sử dụng mô hình
def main():
    print("=== Vietnamese Q&A Chatbot with ML Pipeline ===")
    print("Required libraries: pandas, numpy, scikit-learn, gensim")
    print("No additional Vietnamese NLP library needed!")

    # Khởi tạo chatbot
    chatbot = VietnameseChatbot()

    # Tải dữ liệu
    file_paths = ['./vi-QA.csv', './merged-data.csv']
    print("Loading data...")
    chatbot.load_data(file_paths)

    # Huấn luyện mô hình
    chatbot.train()

    # Lưu mô hình
    chatbot.save_model()

    # In thống kê
    stats = chatbot.get_stats()
    print(f"\n=== Model Statistics ===")
    print(f"Total Q&A pairs: {stats['total_qa_pairs']}")
    print(f"Processed questions: {stats['processed_questions']}")
    print(f"Vocabulary size: {stats['vocabulary_size']}")

    # Test chatbot
    print("\n=== Testing Chatbot ===")
    test_questions = [
        "Thích người như thế nào?",
        "Có yêu ai không?",
        "Học toán khó không?",
        "Làm sao để học giỏi?",
        "Có định tỏ tình không?",
        "Bạn sống ở đâu?",
        "Sở thích của bạn là gì?"
    ]

    for question in test_questions:
        print(f"\nQ: {question}")
        result = chatbot.predict_answer(question)
        print(f"A: {result['answer']}")
        print(f"Confidence: {result['confidence']:.4f}")
        print(f"Matched Question: {result['question_matched']}")
        print("-" * 50)

    # Chế độ chat interactive
    print("\n=== Interactive Chat Mode ===")
    print("Nhập câu hỏi của bạn (gõ 'quit' để thoát):")
    print("Lệnh đặc biệt:")
    print("- 'stats': Xem thống kê mô hình")
    print("- 'add <question>|<answer>': Thêm cặp Q&A mới")

    while True:
        user_input = input("\nBạn: ").strip()
        if user_input.lower() in ['quit', 'exit', 'thoát']:
            break
        elif user_input.lower() == 'stats':
            stats = chatbot.get_stats()
            for key, value in stats.items():
                if key != 'tfidf_features':
                    print(f"{key}: {value}")
        elif user_input.lower().startswith('add '):
            try:
                qa_part = user_input[4:]  # Bỏ 'add '
                if '|' in qa_part:
                    question, answer = qa_part.split('|', 1)
                    chatbot.add_qa_pair(question.strip(), answer.strip())
                else:
                    print("Format: add <question>|<answer>")
            except:
                print("Lỗi khi thêm Q&A pair")
        elif user_input:
            result = chatbot.predict_answer(user_input)
            print(f"Bot: {result['answer']}")
            print(f"(Confidence: {result['confidence']:.2f})")

    print("\nCảm ơn bạn đã sử dụng chatbot!")


if __name__ == "__main__":
    main()