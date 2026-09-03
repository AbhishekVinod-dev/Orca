import requests
import json

def get_marine_weather_forecast(lat: float, lon: float):
    url = 'https://marine-api.open-meteo.com/v1/marine'
    params = {'latitude': lat, 'longitude': lon, 'hourly': 'wave_height,wave_direction,wave_period'}
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if 'hourly' in data and 'wave_height' in data['hourly']:
            heights = [h for h in data['hourly']['wave_height'][:24] if h is not None]
            if not heights:
                return json.dumps({'error': 'No wave data available.'})
            avg_height = sum(heights) / len(heights)
            max_height = max(heights)
            return json.dumps({'latitude': lat, 'longitude': lon, 'average_wave_height_24h_meters': round(avg_height, 2), 'max_wave_height_24h_meters': round(max_height, 2)})
        return json.dumps({'error': 'No hourly data returned.'})
    except Exception as e:
        return json.dumps({'error': str(e)})
