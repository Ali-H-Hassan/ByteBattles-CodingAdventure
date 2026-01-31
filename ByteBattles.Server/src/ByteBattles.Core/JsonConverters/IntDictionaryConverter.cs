using System.Text.Json;
using System.Text.Json.Serialization;

namespace ByteBattles.Core.JsonConverters;

/// <summary>
/// JSON converter for Dictionary&lt;int, int&gt; that handles string keys from JavaScript.
/// JavaScript object keys are always strings, so we need to convert them to integers.
/// </summary>
public class IntDictionaryConverter : JsonConverter<Dictionary<int, int>?>
{
    public override Dictionary<int, int>? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
        {
            return null;
        }

        if (reader.TokenType != JsonTokenType.StartObject)
        {
            throw new JsonException("Expected start of object");
        }

        var dictionary = new Dictionary<int, int>();

        while (reader.Read())
        {
            if (reader.TokenType == JsonTokenType.EndObject)
            {
                return dictionary;
            }

            if (reader.TokenType != JsonTokenType.PropertyName)
            {
                throw new JsonException("Expected property name");
            }

            // Read the key as a string and convert to int
            var keyString = reader.GetString();
            if (string.IsNullOrEmpty(keyString) || !int.TryParse(keyString, out var key))
            {
                throw new JsonException($"Invalid dictionary key: {keyString}");
            }

            // Read the value
            reader.Read();
            if (reader.TokenType != JsonTokenType.Number)
            {
                throw new JsonException("Expected number value");
            }

            var value = reader.GetInt32();
            dictionary[key] = value;
        }

        throw new JsonException("Unexpected end of JSON");
    }

    public override void Write(Utf8JsonWriter writer, Dictionary<int, int>? value, JsonSerializerOptions options)
    {
        if (value == null)
        {
            writer.WriteNullValue();
            return;
        }

        writer.WriteStartObject();
        foreach (var kvp in value)
        {
            writer.WritePropertyName(kvp.Key.ToString());
            writer.WriteNumberValue(kvp.Value);
        }
        writer.WriteEndObject();
    }
}

