from django.test import TestCase
from unittest.mock import patch, Mock
import requests


def get_entity_data(entity_id):
    url = f"http://127.0.0.1/entity/api/actors/{entity_id}"

    try:
        response = requests.get(url)
        response.raise_for_status()

        return response.json()
    
    except requests.exceptions.HTTPError as e:
        return {"error": f"HTTP error {response.status_code}: {e}"}
    except requests.exceptions.ConnectionError:
        return {"error": "Connection failed"}
    except requests.exceptions.Timeout:
        return {"error": "Request timed out"}
    except Exception as e:
        return {"error": str(e)}


class TestEntityData(TestCase):
    
    @patch('requests.get')
    def test_get_entity_data(self, mock_get):
        mock_response = Mock()
        response_dict = {'name': "Coocked", "email": "such a boring"}
        mock_response.json.return_value = response_dict

        mock_get.return_value = mock_response

        entity_data = get_entity_data(1)

        mock_get.assert_called_with("http://127.0.0.1/entity/api/actors/1")
        self.assertEqual(entity_data, response_dict)

    @patch('requests.get')
    def test_404_error(self, mock_get):
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("404 Not Found")
        mock_response.status_code = 404
        mock_get.return_value = mock_response

        err = get_entity_data(999)

        self.assertIn("HTTP error 404", err["error"])

    @patch('requests.get')
    def test_connection_error(self, mock_get):
        mock_get.side_effect = requests.exceptions.ConnectionError

        result = get_entity_data(1)

        self.assertEqual(result, {"error": "Connection failed"})

    @patch('requests.get')
    def test_timeout_error(self, mock_get):
        mock_get.side_effect = requests.exceptions.Timeout

        result = get_entity_data(1)

        self.assertEqual(result, {"error": "Request timed out"})
        