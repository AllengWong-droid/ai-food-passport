class OpenAiMenuResponseSchema {
  const OpenAiMenuResponseSchema._();

  static const spec = {
    'type': 'object',
    'required': ['dishes'],
    'properties': {
      'dishes': {
        'type': 'array',
        'items': {
          'type': 'object',
          'required': [
            'dishName',
            'description',
            'ingredients',
            'allergens',
            'tasteScore',
            'safetyScore',
            'valueScore',
            'recommendationReason',
          ],
          'properties': {
            'dishName': {'type': 'string'},
            'description': {'type': 'string'},
            'ingredients': {
              'type': 'array',
              'items': {'type': 'string'},
            },
            'allergens': {
              'type': 'array',
              'items': {'type': 'string'},
            },
            'tasteScore': {'type': 'integer', 'minimum': 0, 'maximum': 100},
            'safetyScore': {'type': 'integer', 'minimum': 0, 'maximum': 100},
            'valueScore': {'type': 'integer', 'minimum': 0, 'maximum': 100},
            'recommendationReason': {'type': 'string'},
            'priceIntelligence': {
              'type': 'object',
              'properties': {
                'localPrice': {'type': 'number'},
                'localCurrency': {'type': 'string'},
                'homePrice': {'type': 'number'},
                'homeCurrency': {'type': 'string'},
                'exchangeRate': {'type': 'number'},
                'assessment': {
                  'type': 'string',
                  'enum': ['Cheap', 'Fair', 'Expensive', 'Good Value'],
                },
              },
            },
          },
        },
      },
    },
  };
}
