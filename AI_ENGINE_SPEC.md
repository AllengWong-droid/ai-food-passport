\# AI Food Passport - AI Engine Specification



\## Core Scores



\### Taste Score



Range:



0-100



Factors:



\* Cuisine preference

\* Ingredient preference

\* Past behavior

\* Travel profile



Interpretation:



90-100 = Excellent Match



70-89 = Good Match



50-69 = Moderate Match



Below 50 = Poor Match



\---



\### Safety Score



Range:



0-100



Factors:



\* Allergens

\* Dietary restrictions

\* Ingredient uncertainty



Interpretation:



100 = Safe



80-99 = Low Risk



50-79 = Medium Risk



Below 50 = High Risk



\---



\### Value Score



Range:



0-100



Factors:



\* Local average price

\* Restaurant category

\* Travel Style

\* Portion expectations



Interpretation:



90-100 = Excellent Value



70-89 = Good Value



50-69 = Fair Value



Below 50 = Poor Value



\---



\## Travel Style Profiles



\### Budget Traveler



Highly price sensitive



\### Standard Traveler



Balanced price/value



\### Luxury Traveler



Experience focused



\---



\## Required JSON Response



{

"dish\_name": "",

"description": "",

"taste\_score": 0,

"safety\_score": 0,

"value\_score": 0,

"ingredients": \[],

"allergens": \[],

"dietary\_flags": \[],

"price\_local": 0,

"price\_home\_currency": 0,

"price\_assessment": "",

"recommendation\_reason": ""

}



