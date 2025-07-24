'use client'

import { Character } from '@/lib/characters'

interface CharacterSelectorProps {
  characters: Character[]
  selectedCharacter: Character
  onCharacterSelect: (character: Character) => void
}

export default function CharacterSelector({ 
  characters, 
  selectedCharacter, 
  onCharacterSelect 
}: CharacterSelectorProps) {
  const categories = {
    friend: '👫 친구 & 유명인',
    romance: '💕 연인',
    family: '👨‍👩‍👧‍👦 가족',
    pet: '🐾 반려동물',
    helper: '🤖 도우미'
  }

  const groupedCharacters = characters.reduce((acc, character) => {
    if (!acc[character.category]) {
      acc[character.category] = []
    }
    acc[character.category].push(character)
    return acc
  }, {} as Record<string, Character[]>)

  return (
    <div className="p-4 h-full overflow-y-auto">{/* Remove bg-white, shadow, rounded styles since it's now integrated */}
      
      <div className="space-y-4">
        {Object.entries(groupedCharacters).map(([category, chars]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              {categories[category as keyof typeof categories]}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {chars.map((character) => (
                <button
                  key={character.id}
                  onClick={() => onCharacterSelect(character)}
                  className={`text-left p-3 rounded-lg border transition-all duration-200 ${
                    selectedCharacter.id === character.id
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{character.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {character.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {character.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}