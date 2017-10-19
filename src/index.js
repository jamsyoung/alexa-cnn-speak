'use strict';

const Alexa = require('alexa-sdk');
// external call to cnn-saas to return the text to speak. `response.data[0].body`
const textToSpeak =
  "Fresh off his scorching performance at Coachella Saturday night (and days before his next one on the festival's second weekend), rocker Jack White announced he'll take a hiatus from touring. White will wrap his touring efforts in support of \"Lazeretto\" with a brief, first-ever acoustic tour that will hit \"the only five states left in the U.S. that he has yet to play,\" according to White's website.  Rounding out the acoustic quartet on tour will be Fats Kaplin, Lillie Mae Rische and Dominic Davis. The shows will be unannounced until day-of-show, with tickets priced at $3 and limited to one ticket per person, to be purchased only at the venue on a first-come, first-served basis. Billboard: Jack White on Not Being a 'Sound-Bite Artist,' Living in the Wrong Era and Why Vinyl Records Are 'Hypnotic' The purposely vague announcement surely has fans (and journalists) scouring the Internet for White's touring history.  Unclear is whether White includes his work with The White Stripes, The Raconteurs and Dead Weather in his touring history, or just his solo road work. Presumably, he's including all of his touring, with all bands, as Billboard could find only 29 states in which he has performed as Jack White. Tour dates with White Stripes add another 12 states.  That leaves nine states for which we could not find a show for White: Hawaii (where a show is scheduled for tomorrow, April 15), Arkansas, Idaho, Utah, Wyoming, Vermont, Iowa, and North and South Dakota. Billboard: Jack White Plays The Hits, Declares 'Music Is Sacred' at Coachella Through the process of elimination (surely he has played Boise, Little Rock, and Salt Lake?), our guess as to which five \"states\" White will play on the brief acoustic run: South and North Dakota, Wyoming, Vermont and ... Puerto Rico? If that's the case, this tour is in for some long jumps, with Puerto Rico to Vermont being a potential beast. (Though shipping acoustic instruments and ribbon mics will be a lot less taxing than a full electrified stage setup.)";

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
  'en-US': {
    translation: {
      SKILL_NAME: 'CNN Speak',
      WELCOME_MESSAGE: 'Hi there!',
      WELCOME_REPROMPT: 'HELLO??',
      DISPLAY_CARD_TITLE: 'CNN Speak',
    }
  }
};

const handlers = {
  LaunchRequest: function() {
    this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
  },
  SpeakIntent: function() {
    const itemSlot = this.event.request.intent.slots.Item;
    let itemName;
    if (itemSlot && itemSlot.value) {
      itemName = itemSlot.value.toLowerCase();
    }

    const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);

    if (textToSpeak) {
      this.attributes.speechOutput = textToSpeak;
      this.attributes.repromptSpeech = 'What???';
      this.emit(':askWithCard', textToSpeak, this.attributes.repromptSpeech, cardTitle, textToSpeak);
    } else {
      let speechOutput = 'I no find';
      const repromptSpeech = '404';
      speechOutput += repromptSpeech;

      this.attributes.speechOutput = speechOutput;
      this.attributes.repromptSpeech = repromptSpeech;

      this.emit(':ask', speechOutput, repromptSpeech);
    }
  },
  'AMAZON.HelpIntent': function() {
    this.attributes.speechOutput = 'Ask me to tell you about something.';
    this.attributes.repromptSpeech = 'Literally say, tell me about ...';
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
  },
  'AMAZON.RepeatIntent': function() {
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
  },
  'AMAZON.StopIntent': function() {
    this.emit('SessionEndedRequest');
  },
  'AMAZON.CancelIntent': function() {
    this.emit('SessionEndedRequest');
  },
  SessionEndedRequest: function() {
    this.emit(':tell', 'SIGH');
  },
  Unhandled: function() {
    this.attributes.speechOutput = 'you asked for me?';
    this.attributes.repromptSpeech = 'you are really bugging me';
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
  }
};

exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
