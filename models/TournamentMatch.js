const mongoose = require('mongoose');

const tournamentMatchSchema = new mongoose.Schema({
  // Tournament reference
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  
  // Match details
  roundNumber: {
    type: Number,
    required: true,
    min: 1
  },
  roundName: {
    type: String, // "Quarter Finals", "Semi Finals", "Finals", etc.
    default: null
  },
  matchNumber: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Participants
  participant1: {
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TournamentParticipant'
    },
    teamName: String,
    score: {
      type: Number,
      default: 0
    }
  },
  participant2: {
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TournamentParticipant'
    },
    teamName: String,
    score: {
      type: Number,
      default: 0
    }
  },
  
  // Winner
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TournamentParticipant',
    default: null
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Schedule
  scheduledTime: {
    type: Date,
    default: null
  },
  startedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  
  // Next match (for bracket progression)
  nextMatchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TournamentMatch',
    default: null
  },
  
  // Additional details
  roomId: {
    type: String,
    default: null
  },
  roomPassword: {
    type: String,
    default: null
  },
  
  // Results
  resultDetails: {
    type: String,
    default: null
  },
  
  // Admin notes
  notes: {
    type: String,
    default: null
  }
}, { 
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Indexes
tournamentMatchSchema.index({ tournamentId: 1, roundNumber: 1 });
tournamentMatchSchema.index({ tournamentId: 1, status: 1 });
tournamentMatchSchema.index({ status: 1, scheduledTime: 1 });

module.exports = mongoose.model('TournamentMatch', tournamentMatchSchema);
