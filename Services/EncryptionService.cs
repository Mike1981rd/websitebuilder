using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Hotel.Services
{
    public class EncryptionService : IEncryptionService
    {
        private readonly string _key;
        
        public EncryptionService(IConfiguration configuration)
        {
            // Get key from configuration or generate a default one
            _key = configuration["Encryption:Key"] ?? GenerateDefaultKey();
        }
        
        public string Encrypt(string plainText)
        {
            if (string.IsNullOrEmpty(plainText))
                return string.Empty;
                
            byte[] key = Encoding.UTF8.GetBytes(_key.PadRight(32).Substring(0, 32));
            byte[] iv = new byte[16];
            
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = key;
                aesAlg.IV = iv;
                
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
                
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(plainText);
                        }
                        return Convert.ToBase64String(msEncrypt.ToArray());
                    }
                }
            }
        }
        
        public string Decrypt(string cipherText)
        {
            if (string.IsNullOrEmpty(cipherText))
                return string.Empty;
                
            byte[] key = Encoding.UTF8.GetBytes(_key.PadRight(32).Substring(0, 32));
            byte[] iv = new byte[16];
            byte[] buffer = Convert.FromBase64String(cipherText);
            
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = key;
                aesAlg.IV = iv;
                
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                
                using (MemoryStream msDecrypt = new MemoryStream(buffer))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            return srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
        }
        
        private string GenerateDefaultKey()
        {
            // Generate a consistent key based on machine name for development
            // In production, this should come from configuration
            return $"Hotel23_{Environment.MachineName}_DefaultKey2025";
        }
    }
}