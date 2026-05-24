import os
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Load environment variables
load_dotenv()

# Configure the Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class BookRecommendationSystem:
    def __init__(self):
        """Initialize the recommendation system with Gemini model"""
        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)
        self.prompt_template = PromptTemplate(
            input_variables=["user_preferences", "available_books", "user_history"],
            template="""
            You are a helpful librarian assistant. Based on the following information, recommend 3-5 books that the user might enjoy.
            
            User preferences: {user_preferences}
            
            Available books in our library: {available_books}
            
            User's reading history (if available): {user_history}
            
            Please provide recommendations in the following format:
            1. [Book Title] by [Author] - A brief reason why the user might enjoy this book
            2. [Book Title] by [Author] - A brief reason why the user might enjoy this book
            ...
            
            Only recommend books that are in the available books list.
            """
        )
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt_template)
    
    def get_recommendations(self, user_preferences, available_books, user_history=None):
        """
        Generate book recommendations based on user preferences
        
        Args:
            user_preferences (str): User's stated preferences
            available_books (list): List of available books in the library
            user_history (list, optional): User's reading history
            
        Returns:
            str: Formatted book recommendations
        """
        if user_history is None:
            user_history = "No previous reading history available."
        
        # Format available books as a string
        available_books_str = "\n".join([f"{book['title']} by {book['author']} ({book['genre']})" 
                                       for book in available_books])
        
        # Get recommendations from the LLM
        response = self.chain.run(
            user_preferences=user_preferences,
            available_books=available_books_str,
            user_history=user_history
        )
        
        return response
        
    def get_book_details(self, book_title, book_author):
        """
        Generate detailed information about a book
        
        Args:
            book_title (str): Title of the book
            book_author (str): Author of the book
            
        Returns:
            str: Detailed information about the book
        """
        prompt = f"""
        Provide detailed information about the book "{book_title}" by {book_author}.
        Include information about:
        - A brief summary of the plot
        - Themes and motifs
        - Writing style
        - Critical reception
        - Similar books that readers might enjoy
        
        Format the response in a reader-friendly way with clear sections.
        """
        
        response = self.llm.invoke(prompt)
        return response.content 