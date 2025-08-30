# Google Tag Manager Setup Guide

## Overview
This application includes comprehensive Google Tag Manager (GTM) integration for tracking user interactions, form submissions, conversions, and page views.

## 🚀 Quick Setup

### 1. Get Your GTM Container ID
1. Visit [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new container for your website
3. Copy your GTM Container ID (format: `GTM-XXXXXXX`)

### 2. Update Environment Variables
1. Copy `.env.example` to `.env`
2. Replace `GTM-XXXXXX` with your actual GTM container ID:
```env
VITE_GTM_ID="GTM-YOUR_ACTUAL_ID"
```

### 3. Update HTML Template
In `index.html`, replace both instances of `GTM-XXXXXX` with your actual container ID:
- Line 10: GTM script tag
- Line 29: GTM noscript iframe

## 📊 Tracked Events

### Form Events
- **form_submission**: When forms are successfully submitted
- **form_start**: When users begin filling forms
- **form_step**: Progress through form fields
- **form_error**: Validation errors

### User Interactions
- **button_click**: All button interactions
- **modal_open**: Modal and dialog opens
- **service_select**: Service category selections
- **navigation**: Route changes and link clicks

### Conversions
- **pitch_generated**: Successful elevator pitch creation
- **requirement_submitted**: Service requirement submissions
- **form_completed**: Form completion events

### Page Views
- **page_view**: Automatic page tracking on route changes

## 🔧 Custom Event Data

Each event includes additional context:
- **timestamp**: Event occurrence time
- **user_agent**: Browser information
- **viewport_width/height**: Screen dimensions
- **form_type**: Type of form interacted with
- **service_category**: Selected service categories
- **company**: Business name (where applicable)
- **conversion_id**: Unique identifiers for conversions

## 📈 GTM Configuration Recommendations

### Create Tags for:
1. **Google Analytics 4** - Link with GA4 property
2. **Facebook Pixel** - Track conversions
3. **Google Ads Conversion** - Track lead generation
4. **LinkedIn Insight Tag** - B2B audience tracking

### Create Triggers for:
- Form Submissions (`event = form_submission`)
- Conversions (`event = conversion`)
- Page Views (`event = page_view`)
- User Interactions (`event = user_interaction`)

### Create Variables for:
- Form Type (`formType`)
- Service Category (`serviceCategory`)
- Company Name (`company`)
- Conversion Value (`conversionValue`)

## 🎯 Enhanced Tracking Features

### Form Analytics
- Track completion rates by form type
- Monitor drop-off points
- Measure form field engagement

### Service Analytics
- Popular service categories
- User journey through services
- Conversion funnel analysis

### User Journey
- Track complete user flow from landing to conversion
- Identify high-performing pages
- Monitor user engagement patterns

## 🛠️ Development & Testing

### Debug Mode
In development, GTM runs in debug mode with console logging:
```javascript
// Check console for GTM events
console.log('GTM Event sent:', eventData);
```

### Testing Events
Use GTM Preview mode to test events before publishing:
1. In GTM, click "Preview"
2. Navigate your site
3. Verify events fire correctly
4. Check data layer values

## 🔍 Troubleshooting

### Common Issues
1. **Events not firing**: Check GTM container ID in both .env and index.html
2. **Missing data**: Verify triggers are set up correctly in GTM
3. **Development vs Production**: Different GTM containers may be needed

### Validation
- Use GTM Preview mode
- Check browser developer tools for dataLayer events
- Verify GA4 Real-time reports

## 📝 Best Practices

1. **Consistent Naming**: Use snake_case for event names
2. **Meaningful Data**: Include relevant context with each event
3. **Performance**: GTM loads asynchronously to avoid blocking
4. **Privacy**: Respect user privacy settings and GDPR compliance
5. **Testing**: Always test in preview mode before publishing

## 🔗 Useful Resources
- [GTM Documentation](https://developers.google.com/tag-manager)
- [GA4 Event Tracking](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [DataLayer Best Practices](https://developers.google.com/tag-manager/devguide)