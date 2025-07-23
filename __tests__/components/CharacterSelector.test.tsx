import { render, screen, fireEvent } from '@testing-library/react'
import CharacterSelector from '@/components/CharacterSelector'
import { defaultCharacters } from '@/lib/characters'

describe('CharacterSelector Component', () => {
  const mockOnCharacterSelect = jest.fn()
  const selectedCharacter = defaultCharacters[0] // AI 여자친구

  beforeEach(() => {
    mockOnCharacterSelect.mockClear()
  })

  test('renders character selector with title', () => {
    render(
      <CharacterSelector
        characters={defaultCharacters}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={mockOnCharacterSelect}
      />
    )

    expect(screen.getByText('캐릭터 선택')).toBeInTheDocument()
  })

  test('renders all characters grouped by category', () => {
    render(
      <CharacterSelector
        characters={defaultCharacters}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={mockOnCharacterSelect}
      />
    )

    // Check category headers
    expect(screen.getByText('💕 연인')).toBeInTheDocument()
    expect(screen.getByText('👨‍👩‍👧‍👦 가족')).toBeInTheDocument()
    expect(screen.getByText('👫 친구')).toBeInTheDocument()
    expect(screen.getByText('🐾 반려동물')).toBeInTheDocument()
    expect(screen.getByText('🤖 도우미')).toBeInTheDocument()

    // Check character names
    expect(screen.getByText('AI 여자친구')).toBeInTheDocument()
    expect(screen.getByText('AI 남자친구')).toBeInTheDocument()
    expect(screen.getByText('댕댕이')).toBeInTheDocument()
    expect(screen.getByText('할아버지')).toBeInTheDocument()
    expect(screen.getByText('귀여운 꼬마')).toBeInTheDocument()
    expect(screen.getByText('츤데레 여친')).toBeInTheDocument()
    expect(screen.getByText('도움이')).toBeInTheDocument()
  })

  test('displays character emojis and descriptions', () => {
    render(
      <CharacterSelector
        characters={defaultCharacters}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={mockOnCharacterSelect}
      />
    )

    // Check emojis are displayed
    expect(screen.getByText('💕')).toBeInTheDocument()
    expect(screen.getByText('💙')).toBeInTheDocument()
    expect(screen.getByText('🐕')).toBeInTheDocument()

    // Check descriptions
    expect(screen.getByText('사랑스럽고 애정 어린 AI 여자친구')).toBeInTheDocument()
    expect(screen.getByText('든든하고 다정한 AI 남자친구')).toBeInTheDocument()
  })

  test('highlights selected character', () => {
    render(
      <CharacterSelector
        characters={defaultCharacters}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={mockOnCharacterSelect}
      />
    )

    const selectedButton = screen.getByRole('button', { name: /AI 여자친구/ })
    expect(selectedButton).toHaveClass('border-purple-500', 'bg-purple-50', 'ring-2', 'ring-purple-200')
  })

  test('calls onCharacterSelect when character is clicked', () => {
    render(
      <CharacterSelector
        characters={defaultCharacters}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={mockOnCharacterSelect}
      />
    )

    const dogCharacterButton = screen.getByRole('button', { name: /댕댕이/ })
    fireEvent.click(dogCharacterButton)

    expect(mockOnCharacterSelect).toHaveBeenCalledTimes(1)
    expect(mockOnCharacterSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'pet-dog',
        name: '댕댕이'
      })
    )
  })

  test('renders empty selector when no characters provided', () => {
    render(
      <CharacterSelector
        characters={[]}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={mockOnCharacterSelect}
      />
    )

    expect(screen.getByText('캐릭터 선택')).toBeInTheDocument()
    expect(screen.queryByText('AI 여자친구')).not.toBeInTheDocument()
  })

  test('handles character selection for each category', () => {
    render(
      <CharacterSelector
        characters={defaultCharacters}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={mockOnCharacterSelect}
      />
    )

    // Test romance category
    const boyfriendButton = screen.getByRole('button', { name: /AI 남자친구/ })
    fireEvent.click(boyfriendButton)
    expect(mockOnCharacterSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'ai-boyfriend', category: 'romance' })
    )

    // Test family category
    const grandfatherButton = screen.getByRole('button', { name: /할아버지/ })
    fireEvent.click(grandfatherButton)
    expect(mockOnCharacterSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'grandfather', category: 'family' })
    )

    // Test pet category
    const dogButton = screen.getByRole('button', { name: /댕댕이/ })
    fireEvent.click(dogButton)
    expect(mockOnCharacterSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'pet-dog', category: 'pet' })
    )
  })

  test('component is scrollable when content overflows', () => {
    render(
      <CharacterSelector
        characters={defaultCharacters}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={mockOnCharacterSelect}
      />
    )

    const container = screen.getByText('캐릭터 선택').closest('div')
    expect(container).toHaveClass('max-h-96', 'overflow-y-auto')
  })
})