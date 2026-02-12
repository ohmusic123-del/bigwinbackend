const mongoose = require('mongoose');

const tournamentParticipantSchema = new mongoose.Schema({
  // Tournament reference
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Team/Player Info
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  inGameName: {
    type: String,
    required: true,
    trim: true
  },
  inGameId: {
    type: String,
    required: true,
    trim: true
  },
  
  // For team tournaments
  teamMembers: [{
    inGameName: String,
    inGameId: String,
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member'
    }
  }],
  
  // Payment
  entryFeePaid: {
    type: Number,
    required: true,
    get: v => Math.round(v * 100) / 100,
    set: v => Math.round(v * 100) / 100
  },
  paidFrom: {
    type: String,
    enum: ['wallet', 'bonus'],
    default: 'wallet'
  },
  
  // Status
  status: {
    type: String,
    enum: ['registered', 'checked_in', 'playing', 'disqualified', 'completed'],
    default: 'registered'
  },
  
  // Check-in (some tournaments require check-in before start)
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: {
    type: Date,
    default: null
  },
  
  // Performance tracking
  kills: {
    type: Number,
    default: 0,
    min: 0
  },
  placement: {
    type: Number,
    default: null,
    min: 1
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Result
  finalPosition: {
    type: Number,
    default: null
  },
  prizeWon: {
    type: Number,
    default: 0,
    get: v => Math.round(v * 100) / 100,
    set: v => Math.round(v * 100) / 100
  },
  prizeClaimed: {
    type: Boolean,
    default: false
  },
  prizeClaimedAt: {
    type: Date,
    default: null
  },
  
  // Contact info
  discordId: {
    type: String,
    default: null
  },
  whatsappNumber: {
    type: String,
    default: null
  },
  
  // Notes
  notes: {
    type: String,
    default: null
  },
  
  // Screenshot/Proof (for result verification)
  resultScreenshot: {
    type: String,
    default: null
  },
  
  // Slot number
  slotNumber: {
    type: Number,
    required: true
  }
}, { 
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Compound indexes
tournamentParticipantSchema.index({ tournamentId: 1, userId: 1 });
tournamentParticipantSchema.index({ tournamentId: 1, status: 1 });
tournamentParticipantSchema.index({ tournamentId: 1, finalPosition: 1 });
tournamentParticipantSchema.index({ userId: 1, status: 1 });

// Ensure one registration per user per tournament (unless maxParticipantsPerUser > 1)
tournamentParticipantSchema.index({ 
  tournamentId: 1, 
  userId: 1, 
  teamName: 1 
}, { unique: true });

module.exports = mongoose.model('TournamentParticipant', tournamentParticipantSchema);
