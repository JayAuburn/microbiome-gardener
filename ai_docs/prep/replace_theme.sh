#!/bin/bash

# Replace APP_NAME and APP_DESCRIPTION
sed -i 's/ModelFlow\.io/Rewild.bio/g' theme.html
sed -i 's/Compare AI model responses/Restore your microbiome through soil-based growing/g' theme.html

# Replace SCHEME NAMES
sed -i 's/\/\* SCHEME1_NAME \*\//Professional Direction - Healing Teal/g' theme.html
sed -i 's/\/\* SCHEME2_NAME \*\//Tech-Forward Direction - Vitality Green/g' theme.html
sed -i 's/\/\* SCHEME3_NAME \*\//Balanced Appeal - Natural Sage/g' theme.html
sed -i 's/\/\* SCHEME4_NAME \*\//Rewilding Earth - Soil Connection/g' theme.html

# Scheme 1: Professional Healing Teal (170° - balanced teal for health/wellness trust)
# Light: 170° 75% 45% | Dark: 170° 70% 50%
sed -i 's/\/\* SCHEME1_PRIMARY_LIGHT \*\//--primary: 170 75% 45%;/g' theme.html
sed -i 's/\/\* SCHEME1_PRIMARY_DARK \*\//--primary: 170 70% 50%;/g' theme.html
sed -i 's/\/\* SCHEME1_BACKGROUND_DARK \*\//170 12% 9%/g' theme.html
sed -i 's/\/\* SCHEME1_MUTED_DARK \*\//170 10% 16%/g' theme.html
sed -i 's/\/\* SCHEME1_BORDER_DARK \*\//170 8% 19%/g' theme.html
sed -i 's/\/\* SCHEME1_CARD_DARK \*\//170 12% 9%/g' theme.html
sed -i 's/\/\* SCHEME1_SECONDARY_DARK \*\//170 10% 16%/g' theme.html

# Scheme 2: Tech-Forward Vitality Green (140° - vibrant growth green for biohackers)
# Light: 140° 85% 50% | Dark: 140° 80% 55%
sed -i 's/\/\* SCHEME2_PRIMARY_LIGHT \*\//--primary: 140 85% 50%;/g' theme.html
sed -i 's/\/\* SCHEME2_PRIMARY_DARK \*\//--primary: 140 80% 55%;/g' theme.html
sed -i 's/\/\* SCHEME2_BACKGROUND_DARK \*\//140 18% 7%/g' theme.html
sed -i 's/\/\* SCHEME2_MUTED_DARK \*\//140 15% 14%/g' theme.html
sed -i 's/\/\* SCHEME2_BORDER_DARK \*\//140 12% 17%/g' theme.html
sed -i 's/\/\* SCHEME2_CARD_DARK \*\//140 18% 7%/g' theme.html
sed -i 's/\/\* SCHEME2_SECONDARY_DARK \*\//140 15% 14%/g' theme.html

# Scheme 3: Balanced Natural Sage (130° - approachable balanced green)
# Light: 130° 70% 48% | Dark: 130° 65% 53%
sed -i 's/\/\* SCHEME3_PRIMARY_LIGHT \*\//--primary: 130 70% 48%;/g' theme.html
sed -i 's/\/\* SCHEME3_PRIMARY_DARK \*\//--primary: 130 65% 53%;/g' theme.html
sed -i 's/\/\* SCHEME3_BACKGROUND_DARK \*\//130 12% 9%/g' theme.html
sed -i 's/\/\* SCHEME3_MUTED_DARK \*\//130 10% 16%/g' theme.html
sed -i 's/\/\* SCHEME3_BORDER_DARK \*\//130 8% 19%/g' theme.html
sed -i 's/\/\* SCHEME3_CARD_DARK \*\//130 12% 9%/g' theme.html
sed -i 's/\/\* SCHEME3_SECONDARY_DARK \*\//130 10% 16%/g' theme.html

# Scheme 4: Rewilding Earth - Soil Connection (35° - warm earth/soil orange-brown)
# Light: 35° 78% 52% | Dark: 35° 73% 57%
sed -i 's/\/\* SCHEME4_PRIMARY_HSL_LIGHT \*\//35 78% 52%/g' theme.html
sed -i 's/\/\* SCHEME4_PRIMARY_HSL_DARK \*\//35 73% 57%/g' theme.html
sed -i 's/\/\* SCHEME4_SUCCESS_HSL_LIGHT \*\//120 75% 48%/g' theme.html
sed -i 's/\/\* SCHEME4_SUCCESS_HSL_DARK \*\//120 70% 53%/g' theme.html
sed -i 's/\/\* SCHEME4_WARNING_HSL_LIGHT \*\//40 90% 58%/g' theme.html
sed -i 's/\/\* SCHEME4_WARNING_HSL_DARK \*\//40 85% 63%/g' theme.html
sed -i 's/\/\* SCHEME4_DESTRUCTIVE_HSL_LIGHT \*\//5 78% 54%/g' theme.html
sed -i 's/\/\* SCHEME4_DESTRUCTIVE_HSL_DARK \*\//5 73% 59%/g' theme.html
sed -i 's/\/\* SCHEME4_BACKGROUND_DARK \*\//35 20% 10%/g' theme.html
sed -i 's/\/\* SCHEME4_MUTED_DARK \*\//35 16% 17%/g' theme.html
sed -i 's/\/\* SCHEME4_BORDER_DARK \*\//35 12% 20%/g' theme.html
sed -i 's/\/\* SCHEME4_CARD_DARK \*\//35 20% 10%/g' theme.html
sed -i 's/\/\* SCHEME4_SECONDARY_DARK \*\//35 16% 17%/g' theme.html

# Scheme 4 preview colors
sed -i 's/\/\* SCHEME4_PREVIEW_COLOR \*\//hsl(35 78% 52%)/g' theme.html
sed -i 's/\/\* SCHEME4_SUCCESS_PREVIEW \*\//hsl(120 75% 48%)/g' theme.html
sed -i 's/\/\* SCHEME4_WARNING_PREVIEW \*\//hsl(40 90% 58%)/g' theme.html
sed -i 's/\/\* SCHEME4_DESTRUCTIVE_PREVIEW \*\//hsl(5 78% 54%)/g' theme.html
sed -i 's/\/\* SCHEME4_DESCRIPTION \*\//Warm earth tones connecting to soil and nature/g' theme.html

# Scheme 4 JavaScript values
sed -i 's/\/\* SCHEME4_PRIMARY_JS_LIGHT \*\//35 78% 52%/g' theme.html
sed -i 's/\/\* SCHEME4_PRIMARY_JS_DARK \*\//35 73% 57%/g' theme.html
sed -i 's/\/\* SCHEME4_SUCCESS_JS_LIGHT \*\//120 75% 48%/g' theme.html
sed -i 's/\/\* SCHEME4_SUCCESS_JS_DARK \*\//120 70% 53%/g' theme.html
sed -i 's/\/\* SCHEME4_WARNING_JS_LIGHT \*\//40 90% 58%/g' theme.html
sed -i 's/\/\* SCHEME4_WARNING_JS_DARK \*\//40 85% 63%/g' theme.html
sed -i 's/\/\* SCHEME4_DESTRUCTIVE_JS_LIGHT \*\//5 78% 54%/g' theme.html
sed -i 's/\/\* SCHEME4_DESTRUCTIVE_JS_DARK \*\//5 73% 59%/g' theme.html

# Replace example text
sed -i 's/\/\* EXAMPLE1_TITLE \*\//Growing Protocol Chat/g' theme.html
sed -i 's/\/\* EXAMPLE1_BUTTON1 \*\//Start Assessment/g' theme.html
sed -i 's/\/\* EXAMPLE2_TITLE \*\//Plant Family Selector/g' theme.html
sed -i 's/\/\* EXAMPLE3_TITLE \*\//Health & Growing Actions/g' theme.html

echo "Theme replacements complete!"
