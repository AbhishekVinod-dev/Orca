from unittest.mock import MagicMock, patch


def _fake_completion(content: str):
    message = MagicMock()
    message.content = content
    choice = MagicMock()
    choice.message = message
    completion = MagicMock()
    completion.choices = [choice]
    return completion


@patch("app.groq_client._get_client")
def test_classify_intent_parses_valid_json(mock_get_client):
    from app.groq_client import classify_intent

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _fake_completion('{"intent": "CYCLONE"}')
    mock_get_client.return_value = mock_client

    assert classify_intent("Is the cyclone dangerous?") == "CYCLONE"


@patch("app.groq_client._get_client")
def test_classify_intent_falls_back_to_general_on_malformed_json(mock_get_client):
    from app.groq_client import classify_intent

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _fake_completion("not json")
    mock_get_client.return_value = mock_client

    assert classify_intent("anything") == "GENERAL"


@patch("app.groq_client._get_client")
def test_classify_intent_falls_back_to_general_on_unknown_intent_value(mock_get_client):
    from app.groq_client import classify_intent

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _fake_completion('{"intent": "NOT_A_REAL_INTENT"}')
    mock_get_client.return_value = mock_client

    assert classify_intent("anything") == "GENERAL"


@patch("app.groq_client._get_client")
def test_generate_advisory_returns_stripped_content(mock_get_client):
    from app.groq_client import generate_advisory

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _fake_completion("  Stay safe out there.  ")
    mock_get_client.return_value = mock_client

    result = generate_advisory("is it safe", "SAFETY", 70, "en")

    assert result == "Stay safe out there."
