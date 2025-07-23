import { defaultCharacters, getCharacterById, getCharactersByCategory, Character } from '@/lib/characters'

describe('Characters Library', () => {
  describe('defaultCharacters', () => {
    test('should have 7 default characters', () => {
      expect(defaultCharacters).toHaveLength(7)
    })

    test('each character should have required properties', () => {
      defaultCharacters.forEach((character) => {
        expect(character).toHaveProperty('id')
        expect(character).toHaveProperty('name')
        expect(character).toHaveProperty('description')
        expect(character).toHaveProperty('emoji')
        expect(character).toHaveProperty('category')
        expect(character).toHaveProperty('systemPrompt')
        expect(character).toHaveProperty('greeting')
        
        // Validate types
        expect(typeof character.id).toBe('string')
        expect(typeof character.name).toBe('string')
        expect(typeof character.description).toBe('string')
        expect(typeof character.emoji).toBe('string')
        expect(typeof character.systemPrompt).toBe('string')
        expect(typeof character.greeting).toBe('string')
        expect(['romance', 'family', 'friend', 'pet', 'helper']).toContain(character.category)
      })
    })

    test('should have unique character IDs', () => {
      const ids = defaultCharacters.map(char => char.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('should contain expected character types', () => {
      const characterIds = defaultCharacters.map(char => char.id)
      
      expect(characterIds).toContain('ai-girlfriend')
      expect(characterIds).toContain('ai-boyfriend')
      expect(characterIds).toContain('pet-dog')
      expect(characterIds).toContain('grandfather')
      expect(characterIds).toContain('cute-child')
      expect(characterIds).toContain('tsundere-girlfriend')
      expect(characterIds).toContain('helper-assistant')
    })
  })

  describe('getCharacterById', () => {
    test('should return character when valid ID is provided', () => {
      const character = getCharacterById('ai-girlfriend')
      
      expect(character).toBeDefined()
      expect(character?.id).toBe('ai-girlfriend')
      expect(character?.name).toBe('AI 여자친구')
      expect(character?.category).toBe('romance')
    })

    test('should return undefined when invalid ID is provided', () => {
      const character = getCharacterById('non-existent-id')
      
      expect(character).toBeUndefined()
    })

    test('should return undefined when empty string is provided', () => {
      const character = getCharacterById('')
      
      expect(character).toBeUndefined()
    })
  })

  describe('getCharactersByCategory', () => {
    test('should return romance characters', () => {
      const romanceCharacters = getCharactersByCategory('romance')
      
      expect(romanceCharacters).toHaveLength(3)
      expect(romanceCharacters.every(char => char.category === 'romance')).toBe(true)
      
      const romanceIds = romanceCharacters.map(char => char.id)
      expect(romanceIds).toContain('ai-girlfriend')
      expect(romanceIds).toContain('ai-boyfriend')
      expect(romanceIds).toContain('tsundere-girlfriend')
    })

    test('should return family characters', () => {
      const familyCharacters = getCharactersByCategory('family')
      
      expect(familyCharacters).toHaveLength(1)
      expect(familyCharacters[0].id).toBe('grandfather')
    })

    test('should return friend characters', () => {
      const friendCharacters = getCharactersByCategory('friend')
      
      expect(friendCharacters).toHaveLength(1)
      expect(friendCharacters[0].id).toBe('cute-child')
    })

    test('should return pet characters', () => {
      const petCharacters = getCharactersByCategory('pet')
      
      expect(petCharacters).toHaveLength(1)
      expect(petCharacters[0].id).toBe('pet-dog')
    })

    test('should return helper characters', () => {
      const helperCharacters = getCharactersByCategory('helper')
      
      expect(helperCharacters).toHaveLength(1)
      expect(helperCharacters[0].id).toBe('helper-assistant')
    })

    test('should return empty array for non-existent category', () => {
      // TypeScript will prevent this at compile time, but testing runtime behavior
      const characters = getCharactersByCategory('non-existent' as any)
      
      expect(characters).toHaveLength(0)
    })
  })

  describe('Character system prompts', () => {
    test('AI girlfriend should have romantic system prompt', () => {
      const character = getCharacterById('ai-girlfriend')
      
      expect(character?.systemPrompt).toContain('여자친구')
      expect(character?.systemPrompt).toContain('사랑스럽고')
      expect(character?.systemPrompt).toContain('자기야')
    })

    test('Pet dog should have playful system prompt', () => {
      const character = getCharacterById('pet-dog')
      
      expect(character?.systemPrompt).toContain('강아지')
      expect(character?.systemPrompt).toContain('멍멍')
      expect(character?.systemPrompt).toContain('활발하고')
    })

    test('Tsundere girlfriend should have tsundere characteristics', () => {
      const character = getCharacterById('tsundere-girlfriend')
      
      expect(character?.systemPrompt).toContain('츤데레')
      expect(character?.systemPrompt).toContain('차갑고')
      expect(character?.systemPrompt).toContain('별로야')
    })
  })

  describe('Character greetings', () => {
    test('each character should have a unique greeting', () => {
      const greetings = defaultCharacters.map(char => char.greeting)
      const uniqueGreetings = new Set(greetings)
      
      expect(uniqueGreetings.size).toBe(greetings.length)
    })

    test('greetings should match character personality', () => {
      const girlfriend = getCharacterById('ai-girlfriend')
      expect(girlfriend?.greeting).toContain('자기야')
      
      const dog = getCharacterById('pet-dog')
      expect(dog?.greeting).toContain('멍멍')
      
      const grandfather = getCharacterById('grandfather')
      expect(grandfather?.greeting).toContain('할아버지')
    })
  })
})