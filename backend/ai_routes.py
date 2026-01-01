from flask import Blueprint, jsonify, request
import os
from google import genai
from google.genai import types

bp = Blueprint('ai', __name__, url_prefix='/api/ai')

def get_client():
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set")
    return genai.Client(api_key=api_key)

@bp.route('/generate', methods=['POST'])
def generate_content():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        model = data.get('model', 'gemini-3-flash-preview')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        client = get_client()
        response = client.models.generate_content(
            model=model,
            contents=prompt
        )
        
        return jsonify({'text': response.text})
    except Exception as e:
        print(f"Error in generate: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        text = data.get('text')
        source_lang = data.get('source_lang')
        target_lang = data.get('target_lang', 'English')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400

        prompt = f'You are an expert linguist. Translate the following {source_lang} text to {target_lang}. If it\'s for an "analysis" request, provide the translation and a brief grammatical note. Text: "{text}"'
        
        client = get_client()
        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt
        )
        
        return jsonify({'text': response.text})
    except Exception as e:
        print(f"Error in translate: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route('/grammar-research', methods=['POST'])
def grammar_research():
    try:
        data = request.get_json()
        topic = data.get('topic')
        language = data.get('language')
        
        if not topic:
            return jsonify({'error': 'Topic is required'}), 400

        prompt = f'Find 3 real-world examples of how "{topic}" is used in {language}. Provide the examples and briefly explain the context.'
        
        client = get_client()
        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt,
            config=types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearch())]
            )
        )
        
        sources = []
        if response.candidates and response.candidates[0].grounding_metadata and response.candidates[0].grounding_metadata.grounding_chunks:
             for chunk in response.candidates[0].grounding_metadata.grounding_chunks:
                 if chunk.web:
                     sources.append({
                         'title': chunk.web.title or 'Source',
                         'uri': chunk.web.uri or '#'
                     })

        return jsonify({
            'text': response.text,
            'sources': sources
        })
    except Exception as e:
        print(f"Error in grammar research: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route('/visualize', methods=['POST'])
def visualize():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        client = get_client()
        response = client.models.generate_content(
            model='gemini-2.5-flash-image',
            contents=types.Part.from_text(f"A vibrant, photorealistic cultural scene for a language learner: {prompt}"),
            config=types.GenerateContentConfig(
                image_generation_config=types.ImageGenerationConfig(
                    aspect_ratio="16:9"
                )
            )
        )

        if response.candidates and response.candidates[0].content and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    return jsonify({'image_url': f"data:image/png;base64,{part.inline_data.data}"})
        
        return jsonify({'error': 'No image generated'}), 500
    except Exception as e:
        print(f"Error in visualize: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route('/reading-passage', methods=['POST'])
def reading_passage():
    try:
        data = request.get_json()
        language = data.get('language')
        level = data.get('level', 'B1')
        
        prompt = f'Generate an interesting 150-word reading passage in {language} at {level} level. Include 3 multiple-choice comprehension questions with a "correctIndex". Format as JSON.'
        
        client = get_client()
        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema={
                    "type": "OBJECT",
                    "properties": {
                        "title": {"type": "STRING"},
                        "passage": {"type": "STRING"},
                        "questions": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "question": {"type": "STRING"},
                                    "options": {"type": "ARRAY", "items": {"type": "STRING"}},
                                    "correctIndex": {"type": "INTEGER"}
                                }
                            }
                        }
                    },
                    "required": ["title", "passage", "questions"]
                }
            )
        )
        
        return jsonify({'text': response.text})
    except Exception as e:
        print(f"Error in reading passage: {e}")
        return jsonify({'error': str(e)}), 500
