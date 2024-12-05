<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_USERNAME', fields: ['username'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $username = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    /**
     * @var Collection<int, Jugadores>
     */
    #[ORM\OneToMany(targetEntity: Jugadores::class, mappedBy: 'creator')]
    private Collection $jugadores;

    /**
     * @var Collection<int, Liga>
     */
    #[ORM\OneToMany(targetEntity: Liga::class, mappedBy: 'creador')]
    private Collection $ligas;

    public function __construct()
    {
        $this->jugadores = new ArrayCollection();
        $this->ligas = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Jugadores>
     */
    public function getJugadores(): Collection
    {
        return $this->jugadores;
    }

    public function addJugadore(Jugadores $jugadore): static
    {
        if (!$this->jugadores->contains($jugadore)) {
            $this->jugadores->add($jugadore);
            $jugadore->setCreator($this);
        }

        return $this;
    }

    public function removeJugadore(Jugadores $jugadore): static
    {
        if ($this->jugadores->removeElement($jugadore)) {
            // set the owning side to null (unless already changed)
            if ($jugadore->getCreator() === $this) {
                $jugadore->setCreator(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Liga>
     */
    public function getLigas(): Collection
    {
        return $this->ligas;
    }

    public function addLiga(Liga $liga): static
    {
        if (!$this->ligas->contains($liga)) {
            $this->ligas->add($liga);
            $liga->setCreador($this);
        }

        return $this;
    }

    public function removeLiga(Liga $liga): static
    {
        if ($this->ligas->removeElement($liga)) {
            // set the owning side to null (unless already changed)
            if ($liga->getCreador() === $this) {
                $liga->setCreador(null);
            }
        }

        return $this;
    }
    /**
     * @return Collection<int, Liga> Ligas terminadas del usuario
     */
    #[Groups(['user:read'])]
    public function getLigasTerminadas(): Collection
    {
        return $this->ligas->filter(function (Liga $liga) {
            return $liga->isTerminada();
        });
    }

    /**
     * @return Collection<int, Liga> Ligas no terminadas del usuario
     */
    #[Groups(['user:read'])]
    public function getLigasNoTerminadas(): Collection
    {
        return $this->ligas->filter(function (Liga $liga) {
            return !$liga->isTerminada();
        });
    }
}
